import { runParameterizedQuery
} from './database-proxy'
import _debug from 'debug'
import {shiftFuturePaymentsToNextDate} from "./helpers/paymentShifter";
var moment = require('moment')

const debug = _debug('app:server:admin:waivePayment')

export async function waivePayment(waivePaymentContext) {
  debug(`calling waivePayment ${JSON.stringify(waivePaymentContext)}`)
  const { paymentId, loanId, paymentDate, paymentSchedule } = waivePaymentContext

  // shift future payments down by one pay cycle
  await shiftFuturePaymentsToNextDate({
    loanId,
    paymentDate,
    paymentSchedule,
  })

  // create the waive payment
  await createWaivePayment(paymentId, paymentDate)
}

async function fetchFuturePayments(loanId, paymentDate) {
  const query = `
          SELECT *, DATE_FORMAT(loanpayment_date, '%Y-%m-%d') as paymentDate
          FROM tbl_loanpayments
          WHERE
          loanpayment_loan = ? AND loanpayment_date >= ?
          ORDER BY loanpayment_date
  `
  return await runParameterizedQuery({
    actionName      : 'fetchFuturePayments',
    paramValueList  : [loanId, paymentDate],
    query,
  })
}

async function createWaivePayment(paymentId, paymentDate) {
  const query = `
          INSERT INTO tbl_loanpayments (
            loanpayment_loan, loanpayment_date, loanpayment_due, loanpayment_amount,
            loanpayment_scheduled, loanpayment_interest, loanpayment_principal,
            loanpayment_rate, loanpayment_paymentschedule, loanpayment_type
          )
          SELECT
            loanpayment_loan, ?, 0, 0,
            'W', loanpayment_interest, loanpayment_principal,
            loanpayment_rate, loanpayment_paymentschedule, loanpayment_type
          FROM tbl_loanpayments
          WHERE loanpayment_id = ?
        `
  await runParameterizedQuery({
    actionName      : 'waiveActualPayment',
    paramValueList  : [paymentDate, paymentId],
    query,
  })
}