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
 *   SELECT
       IF(loan_result.loan_status = 'P', 0, COUNT(*)) as remainingPaymentsCount,
       IF(loan_result.loan_status = 'P', 0, SUM(p.loanpayment_principal)) as remainingBalance,
       loan_result.*
     FROM tbl_loanpayments p
     INNER JOIN
     (
       SELECT
       distinct e.fname, e.lname, e.hstate, l.loan_id, l.loan_number, l.loan_funddate,
       l.loan_rate, l.loan_amount, l.loan_notedate, l.loan_status
       FROM
       e_applications e,
       tbl_loans l
       WHERE e.application_member = l.loan_member
       ORDER BY l.loan_funddate DESC
       LIMIT 40
     ) AS loan_result
     ON loan_result.loan_id = p.loanpayment_loan
     AND (loan_result.loan_status = 'P' OR p.loanpayment_amount < p.loanpayment_due)
     GROUP BY p.loanpayment_loan

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
      .distinct('e.fname', 'e.lname', 'e.hstate', 'e.email', 'l.loan_id', 'l.loan_number', 'l.loan_funddate',
        'l.loan_rate', 'l.loan_amount', 'l.loan_notedate', 'l.loan_status')
      .select()
      .from('e_applications as e')
      .join('tbl_loans as l', function() {
        this.on('e.application_member', '=', 'l.loan_member')
        if (filterContext.fundStartDate) {
          this.andOn(queryBuilder.raw(`l.loan_funddate > '${filterContext.fundStartDate}'`))
        }
        else {
          var twoMonthsAgo = new Date();
          twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
          this.andOn(queryBuilder.raw(`l.loan_funddate > '${twoMonthsAgo.toISOString().slice(0, 10)}'`))
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
      })
      .orderBy('l.loan_funddate', 'desc')
      .as('loan_result')

  if (filterContext.addressWanted == true) {
    loanInner.distinct('e.hstnum', 'e.hstname', 'e.haptnum', 'e.hcity', 'e.hzip')
  }

  // for each loan in list, fetch all payments and calculate balance and remaining payments count
  const paymentOuter =
    queryBuilder
      .select(queryBuilder.raw("IF(loan_result.loan_status = 'P', 0, COUNT(*)) as remainingPaymentsCount"),
        queryBuilder.raw("IF(loan_result.loan_status = 'P', 0, SUM(p.loanpayment_principal)) as remainingBalance"),
        "loan_result.*")
      .from('tbl_loanpayments as p')
      .join(loanInner, function() {
        this.on('loan_result.loan_id', '=', 'p.loanpayment_loan')
          .andOn(queryBuilder.raw("(loan_result.loan_status = 'P' OR p.loanpayment_amount < p.loanpayment_due)"))
      })
      .orderBy('loan_result.loan_funddate', 'desc')
      .groupBy('p.loanpayment_loan')

  // only use the query that joins payments table when balance or remaining payments is needed
  const query = filterContext.balanceWanted == true || filterContext.remainingPaymentsWanted == true
                ? paymentOuter
                : loanInner

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