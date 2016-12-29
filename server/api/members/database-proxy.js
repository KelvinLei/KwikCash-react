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

export const runParameterizedQuery = ({
  actionName,
  query,
  paramValueList,
}) => {
  debug(`Executing action ${actionName},
          query ${query}
          paramValueList ${JSON.stringify(paramValueList)}`);

  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      connection.query(
        query,
        paramValueList,
        (err, rows) => {
          if (rows) {
            resolve(rows);
          } else {
            debug(`Failed to run action ${actionName} err ${err}`)
            reject(new Error(`Failed to run action ${actionName}`));
          }
        })
      connection.release()
    })
  });
}
