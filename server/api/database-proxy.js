import mysql from 'mysql'
import _debug from 'debug'
const debug = _debug('app:server:api:databaseproxy')

var pool = mysql.createPool({
  host     : 'kwikcashonline.net',
  user     : 'kwikca5_wp',
  password : 'fhXm9BnPx3', // TODO: find a better way to store password
  database : 'kwikca5_wp'
})

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
 * This returns all loans and all payments for a given user
 * @param userId
 * @returns {Promise}
 */
export function getLoanList(userId) {
  debug('getLoanList ' + userId);

  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
        connection.query(`
            select a.loan_member, a.loan_id, a.loan_number, a.loan_date, a.loan_status, a.loan_amount, 
                   a.loan_funddate, a.loan_rate, a.loan_term, a.loan_amount, b.loanpayment_date, 
                   b.loanpayment_amount, b.loanpayment_due, b.loanpayment_principal, b.loanpayment_interest, 
                   b.loanpayment_scheduled, b.loanpayment_paymentschedule
            from tbl_loans a
            join tbl_loanpayments b
            where a.loan_id = b.loanpayment_loan and a.loan_member = ?
            order by a.loan_funddate desc, loanpayment_date asc`, [userId],
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
