import { getLoanList } from './database-proxy'
import _debug from 'debug'
import { PAYMENT_SCHEDULE_MAPPING } from '../shared/payments-schedule-mapping'
import {isPaymentPaid} from "./payments";

const debug = _debug('app:server:api:loan-list')

var LOAN_STATUS_MAP = {
  A: 'ACTIVE',
  L: 'LATE',
  M: 'MANUAL',
  P: 'PAID',
  D: 'Charged off',
  F: 'PLAN'
}

const formatToCurrency = (num) => {
  return Number(num).toFixed(2)
}

export async function getLoans(userId) {
  var rows = await getLoanList(userId)
  debug(JSON.stringify(rows))

  // create a map that keys on loan id and values on an array that has all payments and loan-level data
  const loansMap = rows.reduce( (prevLoanMap, currPayment) => {
    if (!prevLoanMap[currPayment.loan_id]) {
      prevLoanMap[currPayment.loan_id] = []
    }

    prevLoanMap[currPayment.loan_id].push(currPayment);
    return prevLoanMap;
  }, {})

  const loanListResult = []
  for (const loanId of Object.keys(loansMap)) {
    const loanPayments = loansMap[loanId]

    // go thru all payments for a loan, and generate an object that contains
    // loan-level data, like loan amount, loan date and etc
    const loanLevelData = getLoanLevelData(loanPayments)

    // calculate loan level data from current payments state, like balance and next payment date
    const loanLevelDataFromPayments = generateLoanDataFromPayments(loanPayments)

    const loanResult = {...loanLevelData, ...loanLevelDataFromPayments}

    loanListResult.push(loanResult)
  }

  // debug('getLoans' + result)
  return loanListResult
}

const getLoanLevelData = (loanPayments) => {
  if (loanPayments.length == 0) {
    return {}
  }
  // loan level data should be the same for all entries
  const currLoan = loanPayments[0]
  return {
    loanId : currLoan.loan_id,
    loanNumber : currLoan.loan_number,
    loanFundAmount: formatToCurrency(currLoan.loan_amount),
    loanFundDate : currLoan.loan_funddate,
    loanRate: currLoan.loan_rate,
    loanTerm: currLoan.loan_term,
    loanStatus : LOAN_STATUS_MAP[currLoan.loan_status],
    loanCode: currLoan.loan_status,
    paymentSchedule: PAYMENT_SCHEDULE_MAPPING[currLoan.loanpayment_paymentschedule],
  }
}

const generateLoanDataFromPayments = (loanPayments) => {
  if (loanPayments.length == 0) {
    return {}
  }

  const initialState = {
    balance: loanPayments[0].loan_amount,
    nextPaymentDate: null,
  }

  return loanPayments.reduce( (prevLoan, currLoan) => {
    const isPaid = isPaymentPaid(currLoan.loanpayment_amount, currLoan.loanpayment_due)

    if (isPaid) {
      prevLoan.balance = formatToCurrency(prevLoan.balance - currLoan.loanpayment_principal)
    }

    const currentLoanDate = new Date(currLoan.loanpayment_date)
    if (!prevLoan.nextPaymentDate && !isPaid && currentLoanDate > Date.now()) {
      prevLoan.nextPaymentDate = currLoan.loanpayment_date
    }

    return {
      balance: prevLoan.balance,
      nextPaymentDate: prevLoan.nextPaymentDate,
    }
  }, initialState)
}
