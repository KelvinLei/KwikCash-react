import { getPaymentsForLoan } from './database-proxy'
import { PAYMENT_SCHEDULE_MAPPING } from './shared/payments-schedule-mapping'
import _debug from 'debug'
import {SCHEDULE_TYPE} from "../shared/loansConstants";
import {convertDateFormat} from "../shared/dateHelper";

const debug = _debug('app:server:api:payments')

export async function getPayments(loanId) {
  const rows = await getPaymentsForLoan(loanId)
  const payments = rows.map((row) => {
    const paymentDate = convertDateFormat(row.loanpayment_date)
    const scheduleType = SCHEDULE_TYPE[row.loanpayment_scheduled]
    return {
        id: row.loanpayment_id,
        paymentDate,
        amountDue: row.loanpayment_due,
        amountPaid: row.loanpayment_amount,
        isPaid: isPaymentPaid(parseFloat(row.loanpayment_amount), row.loanpayment_due),
        interest: row.loanpayment_interest,
        principal: row.loanpayment_principal,
        scheduled: scheduleType,
        paymentSchedule: PAYMENT_SCHEDULE_MAPPING[row.loanpayment_paymentschedule],
    }
  })

  const firstRow = rows[0];

  return {
    payments: payments,
    loanId: firstRow.loanpayment_loan,
    interestRate: firstRow.loanpayment_rate,
  }
}

export const isPaymentPaid = (amountPaid, amountDue) => {
  return amountPaid >= amountDue
}
