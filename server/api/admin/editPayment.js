import { runParameterizedQuery
} from './database-proxy'
import _debug from 'debug'
import {fetchPayoffForDate} from "./fetchPayoff"
var moment = require('moment')

const debug = _debug('app:server:admin:editPayment')

export async function editPayment(editPaymentContext) {
  debug(`calling editPayment`)
  const {
    paymentId,
    paymentScheduled,
    paymentMethod,
    amountDue,
    amountPaid,
    paymentDate,
    principal,
    interest,
    rate,
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

  return await runParameterizedQuery({
    actionName      : 'editPayment',
    paramValueList  : [paymentDate, amountDue, amountPaid, principal, interest, paymentScheduled, rate, paymentMethod, paymentId],
    query,
  })
}
