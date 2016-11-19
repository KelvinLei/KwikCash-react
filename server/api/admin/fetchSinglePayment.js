import { runParameterizedQuery } from './database-proxy'
import _debug from 'debug'
import {SCHEDULE_TYPE, PAYMENT_TYPE} from "../shared/loansConstants";
import {PAYMENT_SCHEDULE_MAPPING} from "../members/shared/payments-schedule-mapping";

const debug = _debug('app:server:admin:api:fetchSinglePayment')

export async function fetchSinglePayment(paymentId) {
  debug(`calling fetchSinglePayment paymentId ${paymentId}`)

  const query = `
        SELECT DISTINCT 
          *, 
          DATE_FORMAT(loanpayment_date, '%Y-%m-%d') as paymentDate,
          l.loan_number,
          m.member_name
        FROM 
          tbl_loanpayments as p,
          tbl_loans as l,
          e_tbl_members as m
        WHERE
          p.loanpayment_loan = l.loan_id AND m.member_id = l.loan_member AND p.loanpayment_id = ?
        ORDER BY p.loanpayment_date
        `
  var rows = await runParameterizedQuery({
    actionName      : 'fetchSinglePayment',
    paramValueList  : [paymentId],
    query,
  })
  if (rows.length == 0) return {}

  const row = rows[0]
  return {
    paymentId         : row.loanpayment_id,
    loanId            : row.loanpayment_loan,
    loanNumber        : row.loan_number,
    memberName        : row.member_name,
    paymentDate       : row.paymentDate,
    amountDue         : row.loanpayment_due,
    amountPaid        : row.loanpayment_amount,
    scheduled         : row.loanpayment_scheduled,
    interest          : row.loanpayment_interest,
    principal         : row.loanpayment_principal,
    rate              : row.loanpayment_rate,
    paymentSchedule   : PAYMENT_SCHEDULE_MAPPING[row.loanpayment_paymentschedule],
    paymentMethod     : row.loanpayment_type,
  }
}