
import { getPaymentsForLoan } from './database-proxy'
import { PAYMENT_SCHEDULE_MAPPING } from './shared/payments-schedule-mapping'
import _debug from 'debug'

const debug = _debug('app:server:api:payments')

export async function getPayments(loanId) {
  const rows = await getPaymentsForLoan(loanId)
  const payments = rows.map((row) => {
    return {
        id: row.loanpayment_id,
        paymentDate: row.loanpayment_date,
        amountDue: row.loanpayment_due,
        amountPaid: row.loanpayment_amount,
        isPaid: isPaymentPaid(parseFloat(row.loanpayment_amount), row.loanpayment_due),
        interest: row.loanpayment_interest,
        principal: row.loanpayment_principal,
        scheduled: row.loanpayment_scheduled,
    }
  })
  const firstRow = rows[0];
  const result = {
    payments: payments,
    loanId: firstRow.loanpayment_loan,
    interestRate: firstRow.loanpayment_rate,
    paymentSchedule: PAYMENT_SCHEDULE_MAPPING[firstRow.loanpayment_paymentschedule],
  }

  debug(JSON.stringify(result))
  return result;
}

export const isPaymentPaid = (amountPaid, amountDue) => {
  return amountPaid >= amountDue
}
