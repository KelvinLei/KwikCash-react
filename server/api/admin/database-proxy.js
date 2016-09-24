import _debug from 'debug'
import pool from '../database'
import queryBuilder from '../database/queryBuilder'
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
            debug('getUser db response ' + JSON.stringify(result))
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
     IF(paymentLoans.loan_status = 'P', MAX(p.loanpayment_date), "") as lastPaymentDateForPaidLoan,
     paymentLoans.*
 FROM
 (
     SELECT
         IF(loan_result.loan_status = 'P', 0, COUNT(*)) as remainingPaymentsCount,
         IF(loan_result.loan_status = 'P', 0, SUM(p.loanpayment_principal)) as remainingBalance,
         loan_result.*
     FROM
     (
         SELECT e.fname, e.lname, e.hstate, l.loan_id, l.loan_number, l.loan_funddate,
                l.loan_rate, l.loan_amount, l.loan_notedate, l.loan_status
         FROM e_applications e
         JOIN tbl_loans as l
         ON e.id = l.loan_application AND l.loan_funddate > DATE_SUB(NOW(), INTERVAL 2 MONTH)
         ORDER BY l.loan_funddate DESC
     ) AS loan_result
     LEFT JOIN tbl_loanpayments p
     ON loan_result.loan_id = p.loanpayment_loan AND p.loanpayment_due > p.loanpayment_amount
     GROUP BY loan_result.loan_id
 ) as paymentLoans
 LEFT JOIN tbl_loanpayments p
 ON p.loanpayment_loan = paymentLoans.loan_id AND p.loanpayment_amount > p.loanpayment_due
 AND paymentLoans.loan_status = 'P'
 GROUP BY paymentLoans.loan_id


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
      .select('e.fname', 'e.lname', 'e.hstate', 'e.email', 'l.loan_id', 'l.loan_number', 'l.loan_funddate',
        'l.loan_rate', 'l.loan_amount', 'l.loan_notedate', 'l.loan_status', 'l.loan_defaultdate',
        'l.loan_recoveryDate', 'l.loan_recoveryBalance', 'l.loan_judgement')
      .from('e_applications as e')
      .join('tbl_loans as l', function() {
        this.on('e.id', '=', 'l.loan_application')
        if (filterContext.fundStartDate) {
          this.andOn(queryBuilder.raw(`l.loan_funddate > '${filterContext.fundStartDate}'`))
        }
        else {
          this.andOn(queryBuilder.raw(`l.loan_funddate > DATE_SUB(NOW(), INTERVAL 2 MONTH)`))
        }

        if (filterContext.fundEndDate) {
          this.andOn(queryBuilder.raw(`l.loan_funddate < '${filterContext.fundEndDate}'`))
        }
        if (filterContext.loanStatus && filterContext.loanStatus != 'ALL') {
          this.andOn(queryBuilder.raw(`l.loan_status = '${filterContext.loanStatus}'`))
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
      .select(queryBuilder.raw("IF(loan_result.loan_status = 'P', 0, COUNT(*)) as remainingPaymentsCount"),
        queryBuilder.raw("IF(loan_result.loan_status = 'P', 0, SUM(p.loanpayment_principal)) as remainingBalance"),
        "loan_result.*")
      .from(loanInner)
      .leftJoin('tbl_loanpayments as p', function() {
        this.on('loan_result.loan_id', '=', 'p.loanpayment_loan')
            .andOn(queryBuilder.raw("p.loanpayment_due > p.loanpayment_amount"))
      })
      .groupBy('loan_result.loan_id').as('paymentLoans')

  const payoffDateQuery =
    queryBuilder
      .select(queryBuilder.raw("IF(paymentLoans.loan_status = 'P', MAX(p.loanpayment_date), '') as lastPaymentDateForPaidLoan"),
        "paymentLoans.*")
      .from(paymentOuter)
      .leftJoin('tbl_loanpayments as p', function() {
        this.on('p.loanpayment_loan', '=', 'paymentLoans.loan_id')
          .andOn('p.loanpayment_amount', '>', 'p.loanpayment_due ')
          .andOn(queryBuilder.raw("paymentLoans.loan_status = 'P'"))
      })
      .groupBy('paymentLoans.loan_id')

  let query
  if (filterContext.payoffDateWanted == true) {
    query = payoffDateQuery
  }
  else if (filterContext.balanceWanted == true || filterContext.remainingPaymentsWanted == true) {
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
            debug('couldnt filter loans')
            reject(new Error("couldnt filter loans from user"));
          }
        })
      connection.release()
    })
  });
}