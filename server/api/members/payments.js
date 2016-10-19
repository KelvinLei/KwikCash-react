import { getPaymentsForLoan } from './database-proxy'
import { PAYMENT_SCHEDULE_MAPPING } from './shared/payments-schedule-mapping'
import _debug from 'debug'
import {SCHEDULE_TYPE} from "../shared/loansConstants";
import {convertDateFormat} from "../shared/dateHelper";

const debug = _debug('app:server:api:payments')

export async function getPayments(loanId) {
  const rows = await getPaymentsForLoan(loanId)

  const payments = rows.filter(filterPayments).map((row) => {
    const paymentDate = convertDateFormat(row.loanpayment_date)
    const scheduleType = SCHEDULE_TYPE[row.loanpayment_scheduled]
    return {
        id: row.loanpayment_id,
        paymentDate,
        amountDue: row.loanpayment_due,
        amountPaid: row.loanpayment_amount,
        isPaid: isPaymentPaid(row.loanpayment_amount, row.loanpayment_due, row.loanpayment_scheduled),
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

/**
 * If loan is paid, we only display payments that are paid previously and the manually paid payment.
 * The ones that in the future and get cancelled (amount due set to 0) due to paying off early
 * don't need to be displayed
 */
const filterPayments = ( paymentRow ) => {
  return !(paymentRow.loan_status == 'P'
            && paymentRow.loanpayment_due == 0
            && paymentRow.loanpayment_scheduled == 'Y')
}

export const isPaymentPaid = (amountPaidInput, amountDueInput, paymentScheduled) => {
  const amountPaid = parseFloat(amountPaidInput)
  const amountDue = parseFloat(amountDueInput)
  if (amountDue <= 0 && paymentScheduled == 'Y')
    return false

  return paymentScheduled == 'W' || amountPaid >= amountDue
}
