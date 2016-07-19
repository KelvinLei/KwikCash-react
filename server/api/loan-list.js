import { getLoanList } from './database-proxy'
import _debug from 'debug'

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
        loanCode: currentLoan.loan_status
      };

      if (!prevLoan.balance) {
        result.balance = currentLoan.loan_fundamount
      }

      if (currentLoan.loanpayment_amount > 0) {
        result.balance -= currentLoan.loanpayment_principal
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

