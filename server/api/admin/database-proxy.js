import _debug from 'debug'
import pool from '../database'
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
 * @param userId
 * @returns {Promise}
 */
export function filterLoansQuery() {
  debug('filter loans ');

  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      connection.query(`
            SELECT
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
              LIMIT 20
            ) AS loan_result
            ON loan_result.loan_id = p.loanpayment_loan 
            AND (loan_result.loan_status = 'P' OR p.loanpayment_amount < p.loanpayment_due)
            GROUP BY p.loanpayment_loan
            `,
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