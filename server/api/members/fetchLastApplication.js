import { runParameterizedQuery } from './database-proxy'
import _debug from 'debug'
import {decrypt} from "../shared/decrypter";

const debug = _debug('app:server:api:fetchLastApplication')

export async function fetchLastApplication(userId) {
  const query = `
      SELECT e_applications.*
      FROM e_applications
      WHERE e_applications.application_member = ?
      ORDER BY time DESC
      LIMIT 1
    `
  const rows = await runParameterizedQuery({
    actionName      : 'fetchLastApplication',
    paramValueList  : [userId],
    query,
  })
  if (rows.length == 0) return {}

  const row = rows[0]

  // debug(`in fetchLastApplication, result rows ${JSON.stringify(rows)}`)
  return {
    firstName       : row.fname,
    middleInitial   : row.mi,
    lastName        : row.lname,
    homePhone       : decrypt(row.hphone.toString()),
    mobilePhone     : decrypt(row.mphone.toString()),
  }
}

export async function fetchLoanInfoForLastApplication(userId) {
  const query = `
      SELECT e_applications.*
      FROM e_applications
      WHERE e_applications.application_member = ? AND e_applications.loan_number > 0
      ORDER BY time DESC
      LIMIT 1
    `
  const rows = await runParameterizedQuery({
    actionName      : 'fetchLastApplication',
    paramValueList  : [userId],
    query,
  })
  if (rows.length == 0) return {}

  const row = rows[0]

  // debug(`in fetchLastApplication, result rows ${JSON.stringify(rows)}`)
  return {
    firstName       : row.fname,
    middleInitial   : row.mi,
    lastName        : row.lname,
    homePhone       : decrypt(row.hphone.toString()),
    mobilePhone     : decrypt(row.mphone.toString()),
    loanNumber      : row.loan_number,
    bankName        : decrypt(row.bank_name.toString()),
    bankAccount     : decrypt(row.bank_account.toString()),
    bankRouting     : decrypt(row.bank_routing.toString()),
    bankType        : row.bank_type == "C" ? "Checking" : "Savings",
  }
}

