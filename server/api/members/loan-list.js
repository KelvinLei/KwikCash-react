import { getLoanList } from './database-proxy'
import _debug from 'debug'
import { PAYMENT_SCHEDULE_MAPPING } from './shared/payments-schedule-mapping'
import { LOAN_STATUS_MAP } from '../shared/loansConstants'
const debug = _debug('app:server:api:loan-list')

const formatToCurrency = (num) => {
  return Number(num).toFixed(2)
}

export async function getLoans(userId) {
  var rows = await getLoanList(userId)
  debug(JSON.stringify(rows))

  const loanListResult = rows.map( (row) => {
    // eligible to re-apply if loan is paid or 12 payments left or less
    const canReapply = row.loan_status == "P" || row.remainingPaymentsCount <= 12
    
    return {
      loanId : row.loan_id,
      loanNumber : row.loan_number,
      loanFundAmount: formatToCurrency(row.loan_amount),
      loanFundDate : row.loan_funddate,
      loanRate: row.loan_rate,
      loanTerm: row.loan_term,
      loanStatus : LOAN_STATUS_MAP[row.loan_status],
      loanCode: row.loan_status,
      paymentSchedule: PAYMENT_SCHEDULE_MAPPING[row.loanpayment_paymentschedule],
      balance: row.remainingBalance,
      nextPaymentDate: row.nextPaymentDate,
      remainingPayments: row.remainingPaymentsCount,
      canReapply
    }
  })

  return loanListResult
}