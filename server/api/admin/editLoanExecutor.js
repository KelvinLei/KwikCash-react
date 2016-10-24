import { editLoanQuery, createPaymentQuery, waiveFuturePaymentsQuery
} from './database-proxy'
import _debug from 'debug'
import {fetchPayoffForDate} from "./fetchPayoff"
var moment = require('moment')

const debug = _debug('app:server:admin:editLoanExecutor')

/**
 if new loan status is paid and previous status is not paid
   get remaining balance from previous paid payment
   get paid off date, default to current date if not provided
   calculate paid off interest
   create a payment that
     payment date = paid off date
     payment schedule = selected payment schedule
     rate = rate
     due = 0
     paid = payoff amount
     principal = remaining balance from previous paid payment
     interest = payoff interest
     extra amount = 0
     scheduled = N
 else
    update paid off date in db

 */
export async function editLoan(editLoanContext) {
  debug(`calling editLoan`)
  const {
    loanId,
    currLoanStatus,
    loanStatus,
    payoffDate,
    paymentSchedule,
    defaultDate,
  } = editLoanContext

  // only generate payoff payment once (when the loan is marked as paid for the first time
  if (loanStatus == 'P' && currLoanStatus != 'P') {
    const payoffData = await fetchPayoffForDate(loanId, payoffDate)
    debug(`loan is marking paid off and a payoff payment gets created with payoff data 
            ${JSON.stringify(payoffData)}`)
    await createPaymentQuery({
      loanId            : loanId,
      due               : 0,
      paid              : payoffData.payoffAmount,
      scheduled         : 'N',
      paymentschedule   : paymentSchedule,
      rate              : payoffData.interestFromNextPayment,
      date              : payoffData.payoffDate,
      interest          : payoffData.payoffInterest,
      principal         : payoffData.balanceFromLastPayment,
    })
    await waiveFuturePaymentsQuery(loanId, payoffData.payoffDate)
  }
  else if (loanStatus == 'D' && currLoanStatus != 'D') {
    const payoffData = await fetchPayoffForDate(loanId, payoffDate)
    debug(`loan is marking charged off and a payoff payment gets created with payoff data 
            ${JSON.stringify(payoffData)}`)
    await createPaymentQuery({
      loanId            : loanId,
      due               : 0,
      paid              : payoffData.balanceFromLastPayment,
      scheduled         : 'C',
      paymentschedule   : paymentSchedule,
      rate              : payoffData.interestFromNextPayment,
      date              : defaultDate,
      interest          : 0,
      principal         : payoffData.balanceFromLastPayment,
    })
    await waiveFuturePaymentsQuery(loanId, defaultDate)
  }

  debug(`editLoanContext ${JSON.stringify(editLoanContext)}`)
  await editLoanQuery(editLoanContext)
}
