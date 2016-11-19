import {runParameterizedQuery} from "./database-proxy";
import _debug from "debug";
var moment = require('moment')

const debug = _debug('app:server:admin:editPayment')

export async function editPayment(editPaymentContext) {
  debug(`calling editPayment`)
  const {
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

  // when unwaive a payment, re-assign amount due value
  const finalAmountDue = currPaymentScheduled == 'W' && paymentScheduled != 'W' ?
                          interest + principal :
                          amountDue
  // update current payment
  await runParameterizedQuery({
    actionName      : 'editPayment',
    paramValueList  : [paymentDate, finalAmountDue, amountPaid, principal, interest, paymentScheduled, rate, paymentMethod, paymentId],
    query,
  })
}
