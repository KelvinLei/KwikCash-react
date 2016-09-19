import { filterLoansQuery } from './database-proxy'
import _debug from 'debug'
import { LOAN_STATUS_MAP } from '../shared/loansConstants'

const debug = _debug('app:server:admin:api:filterLoans')

const formatToCurrency = (num) => {
  return Number(num).toFixed(2)
}

export async function filterLoans() {
  
  var rows = await filterLoansQuery()
  debug(JSON.stringify(rows))

  const loanListResult = rows.map( (row) => {
    return {
      loanId : row.loan_id,
      loanNumber : row.loan_number,
      loanFundAmount: formatToCurrency(row.loan_amount),
      firstName : row.fname,
      lastName : row.lname,
      state : row.hstate,
      loanFundDate : row.loan_funddate,
      loanNoteDate : row.loan_notedate,
      loanRate: row.loan_rate,
      loanStatus : LOAN_STATUS_MAP[row.loan_status],
      loanCode: row.loan_status,
      balance: row.remainingBalance,
      remainingPayments: row.remainingPaymentsCount,
    }
  })

  return loanListResult
}