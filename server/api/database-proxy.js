import mysql from 'mysql'
import _debug from 'debug'
const debug = _debug('app:server:api:databaseproxy')

var pool = mysql.createPool({
  host     : 'kwikcash-app.cfmywxse2pds.us-east-1.rds.amazonaws.com',
  user     : 'kwikcash_dev',
  password : 'TPIN6u$OfbP9', // TODO: find a better way to store password
  database : 'kwikca5_wp'
})

export function getEncryptedPasswordForUser(userName, callback) {
  pool.getConnection(function(err, connection) {
    connection.query('select member_password from e_tbl_members where member_username="' + userName + '"', 
      (err, rows) => {
        let result;
        if (rows.length) {
	       debug('getEncryptedPasswordForUser database response ' + rows[0].member_password)
            result = rows[0].member_password;
        } else {
           debug("couldnt validate user");
        }
        callback(result);
    })
    connection.release()
  })
}

