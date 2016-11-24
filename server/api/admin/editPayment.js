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
    rate,
    principal,
    interest,
  } = editPaymentContext

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
  // for all cases that are not unwaive
  else {
    // update current payment
    await runParameterizedQuery({
      actionName      : 'editPayment',
      paramValueList  : [paymentDate, amountDue, amountPaid, principal, interest, paymentScheduled, rate, paymentMethod, paymentId],
      query,
    })
  }
}
