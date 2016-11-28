import {runParameterizedQuery} from "./database-proxy";
import _debug from "debug";
import {deletePayment} from "./deletePayment";
import {shiftFuturePaymentsToPrevDate} from "./helpers/paymentShifter";
var moment = require('moment')

const debug = _debug('app:server:admin:editPayment')

export async function editPayment(editPaymentContext) {
  debug(`calling editPayment`)
  const {
    loanId,
    paymentId,
    currPaymentScheduled,
    paymentScheduled,
    paymentMethod,
    amountDue,
    amountPaid,
    paymentDate,
    postponeDate,
    rate,
    principal,
    interest,
  } = editPaymentContext

  // when unwaive a payment, shift future payments back up by one pay cycle
  // because when we waive a payment, we shift future payments back down by one pay cycle
  // so all we need to do for unwaive is undo the initial shift
  const isUnwaive = currPaymentScheduled == 'W' && paymentScheduled != 'W'
  if (isUnwaive) {
    // remove the payment that gets unwaived
    // note that this waived payment is created to fill the date spot that we originally shift the payments from
    // since we are shifting the payments back up by one pay cycle, we no longer need this waived payment
    await deletePayment(paymentId)

    // shift future payments back up by one pay cycle
    await shiftFuturePaymentsToPrevDate({
      loanId,
      paymentDate,
    })
  }
  else if (paymentScheduled == 'POSTPONE') {
    // check if passed in postpone date is valid
    const validatedPostponeDate = postponeDate || paymentDate
    // create a new payment for the deferred date
    await createPostponedPayment(paymentId, validatedPostponeDate)

    // waive the payment
    await waivePayment(paymentId)
  }
  // for all cases that are not unwaive
  else {
    const query = `
      UPDATE tbl_loanpayments
      SET
      loanpayment_date = ?,
      loanpayment_due = ?,
      loanpayment_amount = ?,
      loanpayment_principal = ?,
      loanpayment_interest = ?,
      loanpayment_scheduled = ?,
      loanpayment_rate = ?,
      loanpayment_type = ?
      WHERE loanpayment_id = ?
    `

    // update current payment
    await runParameterizedQuery({
      actionName      : 'editPayment',
      paramValueList  : [paymentDate, amountDue, amountPaid, principal, interest, paymentScheduled, rate, paymentMethod, paymentId],
      query,
    })
  }
}

async function waivePayment(paymentId) {
  const query = `
      UPDATE tbl_loanpayments
      SET
      loanpayment_due = 0,
      loanpayment_scheduled = 'W'
      WHERE loanpayment_id = ?
  `
  await runParameterizedQuery({
    actionName      : 'waivePayment',
    paramValueList  : [paymentId],
    query,
  })
}

async function createPostponedPayment(paymentId, postponeDate) {

  const query = `
          INSERT INTO tbl_loanpayments (
            loanpayment_loan, loanpayment_date, loanpayment_due, loanpayment_amount,
            loanpayment_scheduled, loanpayment_interest, loanpayment_principal,
            loanpayment_rate, loanpayment_paymentschedule, loanpayment_type
          )
          SELECT
            loanpayment_loan, ?, loanpayment_due, 0,
            loanpayment_scheduled, loanpayment_interest, loanpayment_principal,
            loanpayment_rate, loanpayment_paymentschedule, loanpayment_type
          FROM tbl_loanpayments
          WHERE loanpayment_id = ?
        `
  await runParameterizedQuery({
    actionName      : 'waiveActualPayment',
    paramValueList  : [postponeDate, paymentId],
    query,
  })
}