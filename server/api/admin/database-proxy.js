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
