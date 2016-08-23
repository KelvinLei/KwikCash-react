import { getLoanList } from './database-proxy'
import _debug from 'debug'
import { PAYMENT_SCHEDULE_MAPPING } from '../shared/payments-schedule-mapping'

const debug = _debug('app:server:api:loan-list')

var LOAN_STATUS_MAP = {
  A: 'ACTIVE',
  L: 'LATE',
  M: 'MANUAL',
  P: 'PAID',
  D: 'Charged off',
  F: 'PLAN'
}

export async function getLoans(userId) {
  var rows = await getLoanList(userId)
  debug(JSON.stringify(rows))

  const loans = rows.reduce((prev, curr) => {
    if (!prev[curr.loan_id]) {
      prev[curr.loan_id] = []
    }
    prev[curr.loan_id].push(curr);
    return prev;
  }, {})

  const result = Object.keys(loans).map(loan => loans[loan]).map(loan => {
    return loan.reduce((prevLoan, currentLoan) => {
      var result = {
        loanId : currentLoan.loan_id,
        loanFundAmount: currentLoan.loan_fundamount,
        loanFundDate : currentLoan.loan_funddate,
        loanRate: currentLoan.loan_rate,
        loanTerm: currentLoan.loan_term,
        loanStatus : LOAN_STATUS_MAP[currentLoan.loan_status],
        loanCode: currentLoan.loan_status,
        paymentSchedule: PAYMENT_SCHEDULE_MAPPING[currentLoan.loanpayment_paymentschedule],
      };

      if (prevLoan.balance === undefined) {
        result.balance = currentLoan.loan_fundamount - currentLoan.loanpayment_principal
      }

      if (prevLoan.balance !== undefined && currentLoan.loanpayment_amount > 0) {
        result.balance = prevLoan.balance - currentLoan.loanpayment_principal
      }

      const currentLoanDate = new Date(currentLoan.loanpayment_date)
      const prevLoanDate = prevLoan.nextPaymentDate ? new Date(prevLoan.nextPaymentDate) : null

      if (!prevLoanDate && currentLoanDate > Date.now()) {
        result.nextPaymentDate = currentLoan.loanpayment_date;
      }

      if (prevLoanDate && currentLoanDate > Date.now() && currentLoanDate < prevLoanDate) {
        result.nextPaymentDate = currentLoan.loanpayment_date
      }
      return {...prevLoan, ...result};
    }, {})
  })

  // debug('getLoans' + result)
  return result
}

