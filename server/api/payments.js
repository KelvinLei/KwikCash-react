
import { getPaymentsForLoan } from './database-proxy'
import _debug from 'debug'

const debug = _debug('app:server:api:payments')

const PAYMENT_SCHEDULE_MAPPING = {
   "M" : "Monthly",
   "4" : "Every 4 Weeks (13 per year)",
   "4n" : "Every 4 Weeks (13.03571429 per year)",
   "W" : "Every 4 Weeks (Old way)",
   "last" : "Last Day of the Month",
   "2" : "Every 2 weeks (78 Periods - 26 per year)",
   "2n" : "Every 2 weeks (78 Periods - 26.0712857 per year)",
   "272" : "Every 2 weeks (72 Periods - 26.0712857 per year)",
   "5th" : "Every 5th/20th (72 Periods)",
   "10th" : "Every 10th/25th (72 Periods)",
   "15th" : "Every 15th/Last Day (72 Periods)",
   "16th" : "Every 1st/16th (72 Periods)",
   "1" : "Every week (156 Periods - 52.1428571 per year)",
   "1mon" : "Every 1st Monday",
   "1tue" : "Every 1st Tuesday",
   "1wed" : "Every 1st Wednesday",
   "1thu" : "Every 1st Thursday",
   "1fri" : "Every 1st Friday",
   "2mon" : "Every 2nd Monday",
   "2tue" : "Every 2nd Tuesday",
   "2wed" : "Every 2nd Wednesday",
   "2thu" : "Every 2nd Thursday",
   "2fri" : "Every 2nd Friday",
   "3mon" : "Every 3rd Monday",
   "3tue" : "Every 3rd Tuesday",
   "3wed" : "Every 3rd Wednesday",
   "3thu" : "Every 3rd Thursday",
   "3fri" : "Every 3rd Friday",
   "4mon" : "Every 4th Monday",
   "4tue" : "Every 4th Tuesday",
   "4wed" : "Every 4th Wednesday",
   "4thu" : "Every 4th Thursday",
   "4fri" : "Every 4th Friday",
   "lfri" : "Last Friday of the Month",
}

export async function getPayments(loanId) {
  const rows = await getPaymentsForLoan(loanId)
  const payments = rows.map((row) => {
    return {
        id: row.loanpayment_id,
        paymentDate: row.loanpayment_date,
        amountDue: row.loanpayment_due,
        amountPaid: row.loanpayment_amount,
        interest: row.loanpayment_interest,
        principal: row.loanpayment_principal,
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

