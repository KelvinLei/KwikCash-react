
import { getPaymentsForLoan } from './database-proxy'
import _debug from 'debug'

const debug = _debug('app:server:api:payments')

export async function getPayments(loanId) {
  var rows = await getPaymentsForLoan(loanId)
  debug(JSON.stringify(rows))
  return rows
}

