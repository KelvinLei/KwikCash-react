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
      connection.query('select member_password from e_tbl_members where member_username="' + userName + '"',
        (err, rows) => {
          let result;
          if (rows.length) {
           debug('getEncryptedPasswordForUser database response ' + rows[0].member_password)
              result = rows[0].member_password;
              resolve(result);
          } else {
             debug("couldnt validate user");
             reject();
          }
      })
      connection.release()
    })
  });
}

