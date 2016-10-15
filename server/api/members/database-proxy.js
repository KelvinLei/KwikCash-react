import _debug from 'debug'
import pool from '../database'
const debug = _debug('app:server:memebrs:api:databaseproxy')


export function getUserByName(userName) {
  debug('getUserByName ' + userName);

  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      connection.query('select member_id, member_username, member_password, member_name from e_tbl_members where member_username = ?', [userName],
        (err, rows) => {
          if (rows && rows.length) {
            var row = rows[0];
            var result = {
              id: row.member_id,
              userId: row.member_username,
              encryptedPassword: row.member_password,
              name: row.member_name,
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

export function getUserById(userId) {
  debug('getUserById ' + userId);

  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      connection.query('select member_id, member_username, member_password, member_name from e_tbl_members where member_id = ?', [userId],
        (err, rows) => {
          if (rows && rows.length) {
            var row = rows[0];
            var result = {
              id: row.member_id,
              userId: row.member_username,
              encryptedPassword: row.member_password,
              name: row.member_name,
            }
            debug('getUserById db response ' + JSON.stringify(result))
            resolve(result);
          } else {
            debug('coudnlt getUserById')
            reject(new Error("couldnt getUserById"));
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
              IF(loan_result.loan_status = 'P' OR loan_result.loan_status = 'D', 0, COUNT(*)) as remainingPaymentsCount, 
              IF(loan_result.loan_status = 'P' OR loan_result.loan_status = 'D', 0, SUM(p.loanpayment_principal)) as remainingBalance, 
              IF(loan_result.loan_status = 'P' OR loan_result.loan_status = 'D', NULL, MIN(p.loanpayment_date)) as nextPaymentDate, 
              loan_result.*
            FROM (
              SELECT 
                 a.loan_member, a.loan_id, a.loan_number, a.loan_date, a.loan_status, a.loan_amount,
                     a.loan_funddate, a.loan_rate, a.loan_term
              FROM 
                tbl_loans a
              WHERE a.loan_member = ?
              ORDER BY a.loan_funddate DESC
            ) AS loan_result
            LEFT JOIN tbl_loanpayments p
            ON loan_result.loan_id = p.loanpayment_loan AND p.loanpayment_due > p.loanpayment_amount
            GROUP BY loan_result.loan_id
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
      connection.query(`
        select p.*, l.loan_status
        from tbl_loanpayments as p, tbl_loans as l
        where p.loanpayment_loan = ? AND l.loan_id = p.loanpayment_loan
        order by p.loanpayment_date
        `
        , [loanId],
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

export function getPaymentExtraQuery(loanId) {
  debug('getPaymentExtraQuery ' + loanId);

  const query = `
    SELECT * FROM tbl_loanextras WHERE loanextra_loan = ${loanId} ORDER BY loanextra_date DESC LIMIT 1
  `
  debug(`getPaymentExtraQuery query ${query}`)
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      connection.query(query,
        (err, rows) => {
          if (rows) {
            // debug('getPaymentExtraQuery database response ' + rows)
            resolve(rows);
          } else {
            debug('couldnt getPaymentExtraQuery')
            reject(new Error("couldnt getPaymentExtraQuery"));
          }
        })
      connection.release()
    })
  });
}

export function changePasswordQuery(userId, encryptedNewPw) {
  debug('changePasswordQuery' + userId);

  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      connection.query('UPDATE e_tbl_members SET member_password = ? WHERE member_id = ?', [encryptedNewPw, userId],
        (err, rows) => {
          if (rows) {
            resolve(rows);
          } else {
            debug('coudnlt changePasswordQuery')
            reject(new Error("couldnt changePasswordQuery"));
          }
        })
      connection.release()
    })
  });
}