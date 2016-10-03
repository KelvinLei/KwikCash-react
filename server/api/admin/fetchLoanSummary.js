import { fetchLoanSummaryQuery, fetchLoanChanges } from './database-proxy'
import _debug from 'debug'
import { LOAN_STATUS_MAP } from '../shared/loansConstants'
import {decrypt} from "../shared/decrypter";
import {getPayments} from "../members/payments";
import {PAYMENT_SCHEDULE_MAPPING} from "../members/shared/payments-schedule-mapping";

const debug = _debug('app:server:admin:api:fetchLoanSummary')

const formatToCurrency = (num) => {
  return Number(num).toFixed(2)
}

export async function fetchLoanSummary(loanId) {
  const loanLevelData = await getLoanSummaryData(loanId)
  const paymentLevelData = await getPayments(loanId)
  const loanChangesData = await getLoanChanges(loanId)

  return {
    loanLevelData,
    paymentLevelData,
    loanChangesData,
  }
}

async function getLoanSummaryData(loanId) {
  debug(`calling getLoanSummaryData for loan id ${loanId}`)
  const loanLevelDataRows = await fetchLoanSummaryQuery(loanId)

  const loanLevelResult = loanLevelDataRows.map( (row) => {
    const memberSsn = decrypt(row.member_ssn.toString())

    const loanFundDate = row.loan_funddate && new Date(row.loan_funddate).toISOString().slice(0, 10)
    const loanNoteDate = row.loan_notedate && new Date(row.loan_notedate).toISOString().slice(0, 10)
    const firstPaymentDate = row.loan_paymentdate && new Date(row.loan_paymentdate).toISOString().slice(0, 10)
    const recoveryDate = row.loan_recoverydate && (new Date(row.loan_recoverydate) > new Date('2002'))
      ? new Date(row.loan_recoverydate).toISOString().slice(0, 10)
      : ''
    const recoveryEndDate = row.loan_recoverystop && (new Date(row.loan_recoverystop) > new Date('2002'))
      ? new Date(row.loan_recoverystop).toISOString().slice(0, 10)
      : ''
    const defaultDate = row.loan_defaultdate && (new Date(row.loan_defaultdate) > new Date('2002'))
      ? new Date(row.loan_defaultdate).toISOString().slice(0, 10)
      : ''
    const manualDate = row.loan_manualdate && (new Date(row.loan_manualdate) > new Date('2002'))
      ? new Date(row.loan_manualdate).toISOString().slice(0, 10)
      : ''
    const lateDate = row.loan_latedate && (new Date(row.loan_latedate) > new Date('2002'))
      ? new Date(row.loan_latedate).toISOString().slice(0, 10)
      : ''
    const refiDate = row.loan_refidate && (new Date(row.loan_refidate) > new Date('2002'))
      ? new Date(row.loan_refidate).toISOString().slice(0, 10)
      : ''
    const nextPaymentDate = row.nextPaymentDate && (new Date(row.nextPaymentDate) > new Date('2002'))
      ? new Date(row.nextPaymentDate).toISOString().slice(0, 10)
      : ''

    return {
      loanId : row.loan_id,
      loanNumber : row.loan_number,
      isRepeatLoan: row.loan_repeat,
      loanFundAmount: formatToCurrency(row.loan_amount),
      memberName : row.member_name,
      firstPaymentDate,
      fundAmount: row.loan_fundamount,
      fundMethod: row.loan_fundmethod,
      memberSsn,
      loanTerm: row.loan_term,
      loanFundDate,
      loanNoteDate,
      nextPaymentDate,
      refiDate,
      loanRate: row.loan_rate.toFixed(2),
      loanStatus : LOAN_STATUS_MAP[row.loan_status],
      loanCode: row.loan_status,
      balance: row.remainingBalance,
      remainingPayments: row.remainingPaymentsCount,
      email: row.member_email,
      defaultDate,
      manualDate,
      lateDate,
      recoveryDate,
      recoveryEndDate,
      recovery: row.loan_recovery,
      recoveryBalance: row.loan_recoverybalance,
      judgement: row.loan_judgement,
    }
  })
  return loanLevelResult.length > 0 ? loanLevelResult[0] : {}
}

async function getLoanChanges(loanId) {
  debug(`calling getLoanChanges for loan id ${loanId}`)
  const loanChangesRows = await fetchLoanChanges(loanId)

  return loanChangesRows.map( (row) => {
    const changeDate = row.loanchange_date && new Date(row.loanchange_date).toISOString().slice(0, 10)
    const paymentDate = row.loanchange_paymentdate && new Date(row.loanchange_paymentdate).toISOString().slice(0, 10)

    return {
      loanId: row.loanchange_loan,
      changeDate,
      loanCode: row.loanchange_status,
      loanStatus : LOAN_STATUS_MAP[row.loanchange_status],
      paymentDate,
      paymentSchedule: PAYMENT_SCHEDULE_MAPPING[row.loanchange_paymentschedule],
      balance: row.loanchange_balance,
      interestRate: row.loanchange_rate.toFixed(2),
      payment: row.loanchange_payment,
      term: row.loanchange_term,
    }
  })
}