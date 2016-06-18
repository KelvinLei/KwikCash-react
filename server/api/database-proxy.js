import mysql from 'mysql'
import _debug from 'debug'
const debug = _debug('app:server:api:databaseproxy')

var pool = mysql.createPool({
  host     : 'kwikcashonline.net',
  user     : 'kwikca5_wp',
  password : 'fhXm9BnPx3', // TODO: find a better way to store password
  database : 'kwikca5_wp'
})

export function getEncryptedPasswordForUser(userName) {
  debug('getEncryptedPasswordForUser' + userName);

  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      connection.query('select member_password from e_tbl_members where member_username = ?', [userName],
        (err, rows) => {
          if (rows.length) {
            debug('getEncryptedPasswordForUser database response ' + rows[0].member_password)
            resolve(rows[0].member_password);
          } else {
            reject(new Error("couldnt validate user"));
          }
      })
      connection.release()
    })
  });
}

export function getLoanList(userName) {
  debug('getLoanList ' + userName);

  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      connection.query('select loan_id, loan_date, loan_status from tbl_loans where loan_member in (select member_id from e_tbl_members where member_username = ?)', [userName],
        (err, rows) => {
          if (rows) {
            debug('getLoanList database response ' + rows)
            resolve(rows);
          } else {
            reject(new Error("couldnt get loans from user"));
          }
      })
      connection.release()
    })
  });
}
