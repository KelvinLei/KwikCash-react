import { getLoanList } from './database-proxy'
import _debug from 'debug'

const debug = _debug('app:server:api:loan-list')

var LOAN_STATUS_MAP = {
  A: 'ACTIVE',
  L: 'LATE',
  M: 'MANUAL',
  P: 'PAID',
  D: 'DEFAULTED',
  F: 'PLAN',
};

export async function getLoans(userName) {
  var rows = await getLoanList(userName)
  debug('getLoans' + rows)
  return rows.map(r => {
    return {
      id : r.loan_id,
      date : r.loan_date,
      status : LOAN_STATUS_MAP[r.loan_status]
    }
  })
}

