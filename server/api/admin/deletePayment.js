import {runParameterizedQuery} from "./database-proxy";
import _debug from "debug";
var moment = require('moment')

const debug = _debug('app:server:admin:deletePayment')

export async function deletePayment(paymentId) {
  debug(`calling deletePayment`)

  const query = `
          DELETE FROM tbl_loanpayments
          WHERE loanpayment_id = ?
        `

  await runParameterizedQuery({
    actionName      : 'deletePaymentQuery',
    paramValueList  : [paymentId],
    query,
  })
}
