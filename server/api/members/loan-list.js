import {runParameterizedQuery} from './database-proxy'
import _debug from 'debug'
import {PAYMENT_SCHEDULE_MAPPING} from './shared/payments-schedule-mapping'
import {LOAN_STATUS_MAP} from '../shared/loansConstants'
import {convertDateFormat} from "../shared/dateHelper";
const debug = _debug('app:server:api:loan-list')

const formatToCurrency = (num) => {
  return Number(num).toFixed(2)
}

/**
 * This returns all loans and calculates remainingPaymentsCount, remainingBalance and next payment date.
 *
 * The query first fetches all the loans for the user, then fetches all the payments for loans.
 *    If the loan is unpaid,
 *      find all unpaid payments, group by loan id, and calculate balance, remaining payments and next payment date
 *    If the loan is paid,
 *      find all payments, group by loan id, and set 0 to both balance and remaining payments.
 *
 */
export async function getLoans(userId) {
  const query = `
    SELECT
      IF(loan_result.loan_status = 'P' OR loan_result.loan_status = 'D', 0, COUNT(*)) as remainingPaymentsCount, 
      IF(loan_result.loan_status = 'P' OR loan_result.loan_status = 'D', 0, SUM(p.loanpayment_principal)) as remainingBalance, 
      IF(loan_result.loan_status = 'P' OR loan_result.loan_status = 'D', NULL, MIN(p.loanpayment_date)) as nextPaymentDate, 
      loan_result.*
    FROM (
      SELECT 
         a.loan_member, a.loan_id, a.loan_number, a.loan_date, a.loan_status, a.loan_amount,
             a.loan_funddate, a.loan_rate, a.loan_term
      FROM 
        tbl_loans a
      WHERE a.loan_member = ?
      ORDER BY a.loan_funddate DESC
    ) AS loan_result
    LEFT JOIN tbl_loanpayments p
    ON loan_result.loan_id = p.loanpayment_loan AND p.loanpayment_due > p.loanpayment_amount
    GROUP BY loan_result.loan_id
  `

  var rows = await runParameterizedQuery({
    actionName      : 'getLoans',
    paramValueList  : [userId],
    query,
  })
  // var rows = await getLoanList(userId)
  debug(JSON.stringify(rows))

  const loanListResult = rows.map((row) => {
    // eligible to re-apply if loan is paid or 12 payments left or less
    const canReapply = row.loan_status == "P" || row.remainingPaymentsCount <= 12

    const nextPaymentDate = convertDateFormat(row.nextPaymentDate)
    const loanFundDate = convertDateFormat(row.loan_funddate)
    const loanRate = row.loan_rate // .toFixed(2)

    return {
      loanId: row.loan_id,
      loanNumber: row.loan_number,
      loanFundAmount: row.loan_amount ? formatToCurrency(row.loan_amount) : 0,
      loanTerm: row.loan_term,
      loanStatus: LOAN_STATUS_MAP[row.loan_status],
      loanCode: row.loan_status,
      paymentSchedule: PAYMENT_SCHEDULE_MAPPING[row.loanpayment_paymentschedule],
      paymentScheduleCode: row.loanpayment_paymentschedule,
      balance: row.remainingBalance ? row.remainingBalance.toFixed(2) : 0,
      remainingPayments: row.remainingPaymentsCount,
      nextPaymentDate,
      loanFundDate,
      loanRate,
      canReapply
    }
  })

  return loanListResult
}