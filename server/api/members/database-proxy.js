import _debug from 'debug'
import pool from '../database'
const debug = _debug('app:server:memebrs:api:databaseproxy')


export function getUser(userId) {
  debug('getUser' + userId);

  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      connection.query('select member_id, member_username, member_password, member_name from e_tbl_members where member_username = ?', [userId],
        (err, rows) => {
          if (rows && rows.length) {
            var row = rows[0];
            var result = {
              id: row.member_id,
              userId: row.member_username,
              encryptedPassword: row.member_password,
              name: row.member_name,
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

export function getUserData(userId) {
  debug('getUserData' + userId);

  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      connection.query('select fname, lname, hcity, hstate, hzip, hphone from e_applications where application_member = ? order by time DESC limit 1', [userId],
        (err, rows) => {
          if (rows && rows.length) {
            var row = rows[0];
            var result = {
              firstName: row.fname,
              lastName: row.lname,
              encryptedCity: row.hcity.toString(),
              state: row.hstate,
              encryptedZip: row.hzip.toString(),
              homePhone: row.hphone.toString(),
            }
            debug('getUserData db response ' + JSON.stringify(result))
            resolve(result);
          } else {
            debug('coudnlt get userData')
            reject(new Error("couldnt get userData"));
          }
      })
      connection.release()
    })
  });
}

/**
 * This returns all loans and calculates remainingPaymentsCount, remainingBalance and next payment date.
 *
 * The query first fetches all the loans for the user, then fetches all the payments for loans.
 *    If the loan is unpaid,
 *      find all unpaid payments, group by loan id, and calculate balance, remaining payments and next payment date
 *    If the loan is paid,
 *      find all payments, group by loan id, and set 0 to both balance and remaining payments.
 *      
 * @param userId
 * @returns {Promise}
 */
export function getLoanList(userId) {
  debug('getLoanList ' + userId);

  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
        connection.query(`
            SELECT
              IF(loan_result.loan_status = 'P', 0, COUNT(*)) as remainingPaymentsCount, 
              IF(loan_result.loan_status = 'P', 0, SUM(p.loanpayment_principal)) as remainingBalance, 
              IF(loan_result.loan_status = 'P', NULL, MIN(p.loanpayment_date)) as nextPaymentDate, 
              loan_result.*
            FROM tbl_loanpayments p
            INNER JOIN
            (
              SELECT 
                 a.loan_member, a.loan_id, a.loan_number, a.loan_date, a.loan_status, a.loan_amount,
                     a.loan_funddate, a.loan_rate, a.loan_term
              FROM 
                tbl_loans a
              WHERE a.loan_member = 384
              ORDER BY a.loan_funddate DESC
            ) AS loan_result
            ON loan_result.loan_id = p.loanpayment_loan 
            AND (loan_result.loan_status = 'P' OR p.loanpayment_amount < p.loanpayment_due)
            GROUP BY p.loanpayment_loan
            `, [userId],
        (err, rows) => {
          if (rows) {
            // debug('getLoanList database response ' + rows)
            resolve(rows);
          } else {
            debug('couldnt get loans from user')
            reject(new Error("couldnt get loans from user"));
          }
      })
      connection.release()
    })
  });
}

export function getPaymentsForLoan(loanId) {
  debug('getPaymentsForLoan ' + loanId);

  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      connection.query('select * from tbl_loanpayments where loanpayment_loan = ?', [loanId],
        (err, rows) => {
          if (rows) {
            // debug('getPaymentsForLoan database response ' + rows)
            resolve(rows);
          } else {
            debug('couldnt get loans from user')
            reject(new Error("couldnt get loans from user"));
          }
      })
      connection.release()
    })
  });
}
