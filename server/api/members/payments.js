import { getPaymentExtraQuery } from './database-proxy'
import { PAYMENT_SCHEDULE_MAPPING } from './shared/payments-schedule-mapping'
import _debug from 'debug'
import {convertDateFormat} from "../shared/dateHelper";
import {SCHEDULE_TYPE_CLIENTS} from "../shared/loansConstants";
import {runParameterizedQuery} from "./database-proxy";
var moment = require('moment')

const debug = _debug('app:server:api:payments')

export async function getPayments(loanId) {
  const rows = await getPaymentsForLoan(loanId)
  const extraRows = await getPaymentExtraQuery(loanId)

  const payments = rows.filter(filterPayments).map((row) => {
    const paymentDate = convertDateFormat(row.loanpayment_date)
    const scheduleType = SCHEDULE_TYPE_CLIENTS[row.loanpayment_scheduled]
    const extraAmount = calculateExtraAmount(extraRows, paymentDate, row.loanpayment_scheduled)

    return {
      id                : row.loanpayment_id,
      amountDue         : row.loanpayment_due,
      amountPaid        : row.loanpayment_amount,
      isPaid            : isPaymentPaid(row.loanpayment_amount, row.loanpayment_due, row.loanpayment_scheduled),
      interest          : row.loanpayment_interest,
      principal         : row.loanpayment_principal,
      scheduled         : scheduleType,
      paymentSchedule   : PAYMENT_SCHEDULE_MAPPING[row.loanpayment_paymentschedule],
      paymentDate,
      extraAmount,
      loanId,
    }
  })

  const firstRow = rows[0];

  return {
    payments: payments,
    loanId: firstRow.loanpayment_loan,
    interestRate: firstRow.loanpayment_rate,
  }
}

async function getPaymentsForLoan(loanId) {
  const varQuery = ` SET @totalPrincipal:=0; `
  await runParameterizedQuery({
    actionName      : 'getPaymentsForLoan',
    paramValueList  : [],
    query           : varQuery,
  })

  const query = `
    SELECT p.*, l.loan_status,
      (@totalPrincipal := @totalPrincipal + p.loanpayment_principal) as principalSum
    FROM tbl_loanpayments as p, tbl_loans as l
    WHERE p.loanpayment_loan = ? AND l.loan_id = p.loanpayment_loan
    ORDER BY p.loanpayment_date
  `

  return await runParameterizedQuery({
    actionName      : 'getPaymentsForLoan',
    paramValueList  : [loanId],
    query,
  })
}

/**
 * Suppress payments that are in the future and get cancelled (amount due set to 0),
 * Due to either paying off early, or manually making principal payments shorterning loan term
 */
const filterPayments = ( paymentRow ) => {
  const isPaidOrDefault = paymentRow.loan_status == 'P' || paymentRow.loan_status == 'D'
  // if principal is 0, suppress it because loan amount has been met
  const isLoanAmountMet = paymentRow.loanpayment_principal == 0

  return !(paymentRow.loanpayment_due == 0
            && paymentRow.loanpayment_scheduled == 'Y')
}

export const isPaymentPaid = (amountPaidInput, amountDueInput, paymentScheduled) => {
  const amountPaid = parseFloat(amountPaidInput)
  const amountDue = parseFloat(amountDueInput)
  if (amountDue <= 0 && paymentScheduled == 'Y')
    return false

  return paymentScheduled == 'W' || amountPaid >= amountDue
}

/**
 * Ensure schedule type is 'Yes' and loan payment extra starting date is before payment date
 */
const calculateExtraAmount = ( extraRows, paymentDate, scheduleType ) => {
  if (extraRows && extraRows.length > 0 && scheduleType == 'Y') {
    const isPaymentAfterExtraDate = moment(extraRows[0].loanextra_date) <= moment(paymentDate)
    return isPaymentAfterExtraDate ? extraRows[0].loanextra_amount : 0
  }
  return 0
}