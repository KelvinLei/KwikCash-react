import _debug from 'debug'
import pool from '../database'
import queryBuilder from '../database/queryBuilder'
import {convertDateFormat} from "../shared/dateHelper";
const debug = _debug('app:server:admin:api:databaseproxy')

export function getUser(userId) {
  debug('getUser' + userId);

  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      connection.query('select * from tbl_admin where admin_username = ?', [userId],
        (err, rows) => {
          if (rows && rows.length) {
            var row = rows[0];
            var result = {
              id: row.admin_id,
              username: row.admin_username,
              encryptedPassword: row.admin_password,
              email: row.admin_email,
            }
            debug('getUserByName db response ' + JSON.stringify(result))
            resolve(result);
          } else {
            debug('coudnlt validate user')
            reject(new Error("couldnt validate user"));
          }
        })
      connection.release()
    })
  });
}

/**
 * This returns all loans and calculates payment-level data like remainingPaymentsCount, remainingBalance
 *
 * The query first fetches all the loans for the user, then fetches all the payments for loans.
 *    If the loan is unpaid,
 *      find all unpaid payments, group by loan id, and calculate balance and remaining payments
 *    If the loan is paid,
 *      find all payments, group by loan id, and set 0 to both balance and remaining payments.
 *
 * Sample query that fetches balance
 *

     SELECT
        IF(loan_result.loan_status = 'P', 0, COUNT(*)) as remainingPaymentsCount,
        IF(loan_result.loan_status = 'P', 0, SUM(p.loanpayment_principal)) as remainingBalance,
        IF(loan_result.loan_status = 'P', NULL, MIN(p.loanpayment_date)) as nextPaymentDate,
        loan_result.*
     FROM
     (
         SELECT e.fname, e.lname, e.hstate, e.email, l.loan_id, l.loan_number, l.loan_funddate,
                l.loan_rate, l.loan_amount, l.loan_notedate, l.loan_status, l.loan_defaultdate,
                l.loan_recoveryDate, l.loan_recoveryBalance, l.loan_judgement
         FROM e_applications e
         JOIN tbl_loans as l
         ON e.id = l.loan_application AND l.loan_funddate > DATE_SUB(NOW(), INTERVAL 2 MONTH)
         ORDER BY l.loan_funddate DESC
     ) AS loan_result
     LEFT JOIN tbl_loanpayments p
     ON loan_result.loan_id = p.loanpayment_loan AND p.loanpayment_due > p.loanpayment_amount
     GROUP BY loan_result.loan_id

 Values in filterContext
        fundStartDate,
        fundEndDate,
        loanStatus,
        state,
        addressWanted,
        emailWanted,
        stateWanted,
        remainingPaymentsWanted,
        balanceWanted,
        defaultDateWanted,
        payoffDateWanted

 * @returns {Promise}
 */
export function filterLoansQuery(filterContext) {
  debug('filter loans ' + JSON.stringify(filterContext));

  // create query to fetch loan list
  const loanInner =
    queryBuilder
      .select(queryBuilder.raw(`e.fname, e.lname, e.hstate, e.email, l.loan_id, l.loan_number,
                                l.loan_rate, l.loan_amount, l.loan_status, 
                                DATE_FORMAT(l.loan_notedate, '%Y-%m-%d') as loan_notedate,
                                DATE_FORMAT(l.loan_funddate, '%Y-%m-%d') as loan_funddate,
                                DATE_FORMAT(l.loan_defaultdate, '%Y-%m-%d') as loan_defaultdate,
                                DATE_FORMAT(l.loan_recoveryDate, '%Y-%m-%d') as loan_recoveryDate,
                                DATE_FORMAT(l.loan_payoffdate, '%Y-%m-%d') as loan_payoffdate,
                                DATE_FORMAT(l.loan_manualdate, '%Y-%m-%d') as loan_manualdate,
                                DATE_FORMAT(l.loan_latedate, '%Y-%m-%d') as loan_latedate
      `))
      .from('e_applications as e')
      .join('tbl_loans as l', function() {
        this.on('e.id', '=', 'l.loan_application')
        if (filterContext.fundStartDate) {
          this.andOn(queryBuilder.raw(`l.loan_notedate >= '${filterContext.fundStartDate}'`))
        }
        else if (!filterContext.payoffStartDate) { // if payoff date is specified, don't default anything
          this.andOn(queryBuilder.raw(`l.loan_notedate >= DATE_SUB(NOW(), INTERVAL 1 MONTH)`))
        }
        if (filterContext.fundEndDate) {
          this.andOn(queryBuilder.raw(`l.loan_notedate <= '${filterContext.fundEndDate}'`))
        }

        if (filterContext.payoffStartDate) {
          this.andOn(queryBuilder.raw(`l.loan_payoffdate >= '${filterContext.payoffStartDate}'`))
        }
        if (filterContext.payoffEndDate) {
          this.andOn(queryBuilder.raw(`l.loan_payoffdate <= '${filterContext.payoffEndDate}'`))
        }

        if (filterContext.loanStatus && filterContext.loanStatus != 'ALL') {
          this.andOn(queryBuilder.raw(`l.loan_status = '${filterContext.loanStatus}'`))
        }
        else if (filterContext.payoffStartDate || filterContext.payoffEndDate) {
          this.andOn(queryBuilder.raw(`l.loan_status = 'P'`))
        }

        if (filterContext.state && filterContext.state != 'All') {
          this.andOn(queryBuilder.raw(`e.hstate = '${filterContext.state}'`))
        }

        if (filterContext.recoveryLoans == true) {
          this.andOn(queryBuilder.raw('l.loan_recovery = "Y"'))
        }
      })
      .orderBy('l.loan_funddate', 'desc')
      .as('loan_result')

  if (filterContext.addressWanted == true) {
    loanInner.select('e.hstnum', 'e.hstname', 'e.haptnum', 'e.hcity', 'e.hzip')
  }

  // for each loan in list, fetch all payments and calculate balance and remaining payments count
  const paymentOuter =
    queryBuilder
      .select(queryBuilder.raw("IF(loan_result.loan_status = 'P' OR loan_result.loan_status = 'D', 0, COUNT(*)) as remainingPaymentsCount"),
        queryBuilder.raw("IF(loan_result.loan_status = 'P' OR loan_result.loan_status = 'D', 0, SUM(p.loanpayment_principal)) as remainingBalance"),
        "loan_result.*")
      .from(loanInner)
      .leftJoin('tbl_loanpayments as p', function() {
        this.on('loan_result.loan_id', '=', 'p.loanpayment_loan')
            .andOn(queryBuilder.raw("p.loanpayment_due > p.loanpayment_amount"))
      })
      .groupBy('loan_result.loan_id').as('paymentLoans')

  let query
  if (filterContext.balanceWanted == true || filterContext.remainingPaymentsWanted == true) {
    query = paymentOuter
  }
  else {
    query = loanInner
  }

  debug(query.toString())
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      connection.query(query.toString(),
        (err, rows) => {
          if (rows) {
            // debug('getLoanList database response ' + rows)
            resolve(rows);
          } else {
            debug(`couldnt filter loans error ${err}`)
            reject(new Error("couldnt filter loans from user"));
          }
        })
      connection.release()
    })
  });
}

export function fetchMembersQuery(memberName) {
  var query = `select * from e_tbl_members 
                WHERE member_name LIKE "${memberName}%" OR member_name LIKE "%${memberName}" 
                ORDER BY member_id DESC`
  if (!memberName) {
    query += ' LIMIT 50'
  }

  debug(query)
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      connection.query(query,
        (err, rows) => {
          if (rows) {
            // debug('getLoanList database response ' + rows)
            resolve(rows);
          } else {
            debug('couldnt fetch members')
            reject(new Error("couldnt fetch members for name " + memberName));
          }
        })
      connection.release()
    })
  });
}

export function fetchLoanSummaryQuery(loanId) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      const query = `
         SELECT
            IF(loan_result.loan_status = 'P' OR loan_result.loan_status = 'D', 0, COUNT(*)) as remainingPaymentsCount,
            IF(loan_result.loan_status = 'P' OR loan_result.loan_status = 'D', 0, SUM(p.loanpayment_principal)) as remainingBalance,
            IF(loan_result.loan_status = 'P' OR loan_result.loan_status = 'D', NULL, MIN(p.loanpayment_date)) as nextPaymentDate,
            loan_result.*
         FROM
         (
             SELECT m.*, l.*
             FROM e_tbl_members m
             JOIN tbl_loans as l
             ON m.member_id = l.loan_member AND l.loan_id = ${loanId}
             ORDER BY l.loan_funddate DESC
         ) AS loan_result
         LEFT JOIN tbl_loanpayments p
         ON loan_result.loan_id = p.loanpayment_loan AND p.loanpayment_due > p.loanpayment_amount
         GROUP BY loan_result.loan_id
      `
      debug(`calling fetchLoanSummaryQuery ${query}`)
      connection.query(query,
        (err, rows) => {
          if (rows) {
            // debug('getLoanList database response ' + rows)
            resolve(rows);
          } else {
            debug('couldnt fetchLoanSummaryQuery')
            reject(new Error("couldnt fetchLoanSummaryQuery for id " + loanId));
          }
        })
      connection.release()
    })
  });
}

export function fetchPayoffQuery(loanId) {
  debug('fetchPayoffQuery ' + loanId);

  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      connection.query(`
        SELECT p.*, l.*,
        DATE_FORMAT(p.loanpayment_date, '%Y-%m-%d') as paymentDate,
        DATE_FORMAT(l.loan_funddate, '%Y-%m-%d') as loanFundDate
        FROM tbl_loanpayments as p, tbl_loans as l
        WHERE p.loanpayment_loan = l.loan_id AND loanpayment_loan = ?
        ORDER BY p.loanpayment_date ASC`, [loanId],
        (err, rows) => {
          if (rows) {
            // debug('fetchPayoffQuery database response ' + JSON.stringify(rows))
            resolve(rows);
          } else {
            debug('couldnt fetchPayoffQuery')
            reject(new Error("couldnt fetchPayoffQuery"));
          }
        })
      connection.release()
    })
  });
}

export function fetchPayoffAuthQuery(loanId) {
  debug('fetchPayoffAuthQuery ' + loanId);

  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      connection.query(`
        select e.*
        from e_applications as e,
        tbl_loans as l
        where e.id = l.loan_application and l.loan_id = ?`, [loanId],
        (err, rows) => {
          if (rows) {
            resolve(rows);
          } else {
            debug('couldnt fetchPayoffAuthQuery')
            reject(new Error("couldnt fetchPayoffAuthQuery"));
          }
        })
      connection.release()
    })
  });
}

export function getRepeatLoanCustomers() {
  debug('getRepeatLoanCustomers');

  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      connection.query(`
        SELECT COUNT(loan_id) AS loan_count, loan_member, member_name, member_email
         FROM tbl_loans, tbl_members
         WHERE loan_member = member_id
         GROUP BY loan_member
         HAVING count(loan_id) > 1`,
        (err, rows) => {
          if (rows) {
            resolve(rows);
          } else {
            debug('couldnt getRepeatLoanCustomers')
            reject(new Error("couldnt getRepeatLoanCustomers"));
          }
        })
      connection.release()
    })
  });
}

export function getExportLoanClientsWithGrossIncome() {
  debug('getExportLoanClientsWithGrossIncome');

  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      connection.query(`
       SELECT id, lname, fname, mi, email, hphone, hstnum, hstname, haptnum, hcity, hstate, hzip, remarket, mgross
       FROM e_applications, tbl_loans
       WHERE loan_application = e_applications.id
       ORDER BY lname, fname`,
        (err, rows) => {
          if (rows) {
            resolve(rows);
          } else {
            debug('couldnt getExportLoanClientsWithGrossIncome')
            reject(new Error("couldnt getExportLoanClientsWithGrossIncome"));
          }
        })
      connection.release()
    })
  });
}

export function fetchMemberProfileQuery(memberId) {
  debug('fetchMemberProfileQuery');

  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      connection.query(`
        select * from e_tbl_members where member_id = ?`, [memberId],
        (err, rows) => {
          if (rows) {
            resolve(rows);
          } else {
            debug('couldnt fetchMemberProfileQuery')
            reject(new Error("couldnt fetchMemberProfileQuery"));
          }
        })
      connection.release()
    })
  });
}

export function editLoanQuery(editLoanContext) {
  debug('editLoanQuery ' + JSON.stringify(editLoanContext));
  const {
    loanId, loanStatus, repeatLoan, paymentSchedule, loanFundAmount, firstPaymentDate,
    loanFundDate, loanNoteDate, refiDate, loanRate, loanTerm, clientFundAmount, fundMethod,
    isJudgement, defaultDate, lateDate, manualDate, isRecovery, recoveryBalance, recoveryDate,
    recoveryEndDate, payoffDate
  } = editLoanContext

  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      const query = `
        UPDATE tbl_loans
        SET
        loan_status = '${loanStatus}', 
        loan_repeat = '${repeatLoan}', 
        loan_paymentschedule = '${paymentSchedule}', 
        loan_payoffdate = '${payoffDate}',
        loan_amount = ${loanFundAmount},
        loan_paymentdate = '${firstPaymentDate}',
        loan_funddate = '${loanFundDate}',
        loan_notedate = '${loanNoteDate}',
        loan_refidate = '${refiDate}',
        loan_rate = ${loanRate},
        loan_term = ${loanTerm},
        loan_fundamount = ${clientFundAmount},
        loan_fundmethod = '${fundMethod}',
        loan_judgement = '${isJudgement}',
        loan_defaultdate = '${defaultDate}',
        loan_latedate = '${lateDate}',
        loan_manualdate = '${manualDate}',
        loan_recovery = '${isRecovery}',
        loan_recoverybalance = ${recoveryBalance},
        loan_recoverydate = '${recoveryDate}',
        loan_recoverystop = '${recoveryEndDate}'
        WHERE loan_id = ${loanId}
      `
      debug(`editLoanQuery query ${query}`)
      connection.query(query,
        (err, rows) => {
          if (rows) {
            resolve(rows);
          } else {
            debug('couldnt editLoanQuery')
            reject(new Error("couldnt editLoanQuery"));
          }
        })
      connection.release()
    })
  });
}


export function updateLoanChangesQuery(editLoanContext) {
  debug('updateLoanChangesQuery ' + JSON.stringify(editLoanContext));
  const {
    loanId, loanStatus, paymentSchedule, loanRate, firstPaymentDate, balance, loanTerm
  } = editLoanContext

  const query = `INSERT INTO tbl_loanchanges
        (
          loanchange_loan,
          loanchange_date,
          loanchange_status,
          loanchange_paymentdate,
          loanchange_paymentschedule,
          loanchange_balance,
          loanchange_rate,
          loanchange_payment,
          loanchange_term
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      connection.query(
        query,
        [loanId, convertDateFormat(new Date()), loanStatus, firstPaymentDate, paymentSchedule, balance, loanRate, 0, loanTerm],
        (err, rows) => {
          if (rows) {
            resolve(rows);
          } else {
            debug(`couldnt updateLoanChangesQuery err ${err}`)
            reject(new Error("couldnt updateLoanChangesQuery"));
          }
        })
      connection.release()
    })
  });
}

export function createPaymentQuery(createPayoffPaymentContext) {
  debug('createPaymentQuery ' + JSON.stringify(createPayoffPaymentContext));
  const {
    loanId, due, scheduled, paymentschedule, rate, paid, date, interest, principal,
  } = createPayoffPaymentContext

  const query = `
        INSERT INTO tbl_loanpayments
        (
          loanpayment_loan,
          loanpayment_date,
          loanpayment_due,
          loanpayment_amount,
          loanpayment_scheduled,
          loanpayment_interest,
          loanpayment_principal,
          loanpayment_rate,
          loanpayment_paymentschedule
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      connection.query(query, [loanId, date, due, paid, scheduled, interest, principal, rate, paymentschedule],
        (err, rows) => {
          if (rows) {
            resolve(rows);
          } else {
            debug(`couldnt createPaymentQuery err ${err}`)
            reject(new Error("couldnt createPaymentQuery"));
          }
        })
      connection.release()
    })
  });
}

export function waiveFuturePaymentsQuery(loanId, date) {
  debug(`waivePaymentsQuery loanId ${loanId} date ${date}`);

  const query = `
    UPDATE tbl_loanpayments
    SET 
    loanpayment_due = 0,
    loanpayment_amount = 0,
    loanpayment_interest = 0,
    loanpayment_principal = 0
    WHERE loanpayment_loan = ? AND loanpayment_date > ?
  `
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      connection.query(query, [loanId, date],
        (err, rows) => {
          if (rows) {
            resolve(rows);
          } else {
            debug(`couldnt waiveFuturePaymentsQuery err ${err}`)
            reject(new Error("couldnt waiveFuturePaymentsQuery"));
          }
        })
      connection.release()
    })
  });
}

export const runParameterizedQuery = ({
  actionName,
  query,
  paramValueList,
}) => {
  debug(`Executing action ${actionName},
          query ${query}
          paramValueList ${JSON.stringify(paramValueList)}`);

  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      connection.query(
        query,
        paramValueList,
        (err, rows) => {
          if (rows) {
            resolve(rows);
          } else {
            debug(`Failed to run action ${actionName} err ${err}`)
            reject(new Error(`Failed to run action ${actionName}`));
          }
        })
      connection.release()
    })
  });
}

/**
 * query to backfill payoff date for all paid loans
 *
 UPDATE tbl_loans as a
 JOIN (
   SELECT
     MAX(p.loanpayment_date) as lastPaymentDateForPaidLoan,
     l.*
   FROM tbl_loans as l
   JOIN tbl_loanpayments p
   ON p.loanpayment_loan = l.loan_id AND p.loanpayment_amount >= p.loanpayment_due
   AND (p.loanpayment_due != 0 || p.loanpayment_scheduled != 'Y') AND l.loan_status = 'P'
   GROUP BY l.loan_id
 ) as pl
 ON a.loan_id = pl.loan_id
 SET
 a.loan_payoffdate = pl.lastPaymentDateForPaidLoan
 */
