import { runParameterizedQuery
} from './database-proxy'
import _debug from 'debug'
import {shiftFuturePaymentsToNextDate} from "./helpers/paymentShifter";
var moment = require('moment')

const debug = _debug('app:server:admin:waivePayment')

export async function waivePayment(waivePaymentContext) {
  debug(`calling waivePayment ${JSON.stringify(waivePaymentContext)}`)
  const { loanId, loanStatus, payment } = waivePaymentContext
  const { id, isPaid, paymentDate, principal } = payment

  // check if the loan is charged off
  if (loanStatus == 'D' && isPaid == true) {
    // zero out the waived payment
    await waiveAndZeroOutPayment(id)
    // adjusts charge off payment to include the principal of waived payment
    await updateChargeOffPaymentForWaive(loanId, principal)
  }
  else {
    // shift future payments down by one pay cycle
    await shiftFuturePaymentsToNextDate({
      loanId,
      paymentDate,
    })

    // create the waive payment
    await createWaivePayment(id, paymentDate)
  }
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
            'W', 0, 0,
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

async function waiveAndZeroOutPayment(paymentId) {
  const query = `
    UPDATE tbl_loanpayments
    SET 
    loanpayment_due = 0, loanpayment_amount = 0, loanpayment_interest = 0, loanpayment_principal = 0,
    loanpayment_scheduled = 'W'
    WHERE loanpayment_id = ?
  `

  await runParameterizedQuery({
    actionName      : 'zeroOutPayment',
    paramValueList  : [paymentId],
    query,
  })
}

async function updateChargeOffPaymentForWaive(loanId, principal) {
  // get the payment id of the charge off payment
  const rows = await runParameterizedQuery({
    actionName      : 'getChargeOffPaymentId',
    paramValueList  : [loanId],
    query : `SELECT loanpayment_id FROM tbl_loanpayments 
            WHERE loanpayment_loan = ? AND loanpayment_scheduled = 'C' LIMIT 1`,
  })
  const chargeOffPaymentId = rows[0].loanpayment_id

  // update charge off payment
  const query = `
    UPDATE tbl_loanpayments
    SET loanpayment_amount = loanpayment_amount + ?, loanpayment_principal = loanpayment_principal + ?
    WHERE loanpayment_id = ?
  `
  await runParameterizedQuery({
    actionName      : 'updateChargeOffPaymentForWaive',
    paramValueList  : [principal, principal, chargeOffPaymentId],
    query,
  })
}
