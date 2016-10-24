import { fetchLoanSummaryQuery, runParameterizedQuery } from './database-proxy'
import _debug from 'debug'
import { LOAN_STATUS_MAP } from '../shared/loansConstants'
import {decrypt} from "../shared/decrypter";
import {getPayments} from "../members/payments";
import {PAYMENT_SCHEDULE_MAPPING} from "../members/shared/payments-schedule-mapping";
import {convertDateFormat} from "../shared/dateHelper";

const debug = _debug('app:server:admin:api:fetchLoanSummary')

const formatToCurrency = (num) => {
  return Number(num).toFixed(2)
}

export async function fetchLoanSummary(loanId) {
  const loanLevelData = await getLoanSummaryData(loanId)
  const paymentLevelData = await getPayments(loanId)
  const loanChangesData = await getLoanChanges(loanId)
  debug(`loanChangesData result  ${JSON.stringify(loanChangesData)}`)

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
    const memberSsn = row.member_ssn ? decrypt(row.member_ssn.toString()) : null
    const paymentScheduleCode = row.loan_paymentschedule
    const paymentSchedule = PAYMENT_SCHEDULE_MAPPING[row.loan_paymentschedule]

    const loanFundDate = convertDateFormat(row.loan_funddate)
    const loanNoteDate = convertDateFormat(row.loan_notedate)
    const payoffDate = convertDateFormat(row.loan_payoffdate)
    const firstPaymentDate = convertDateFormat(row.loan_paymentdate)
    const recoveryDate = convertDateFormat(row.loan_recoverydate)
    const recoveryEndDate = convertDateFormat(row.loan_recoverystop)
    const defaultDate = convertDateFormat(row.loan_defaultdate)
    const manualDate = convertDateFormat(row.loan_manualdate)
    const lateDate = convertDateFormat(row.loan_latedate)
    const refiDate = convertDateFormat(row.loan_refidate)
    const nextPaymentDate = convertDateFormat(row.nextPaymentDate)

    return {
      loanId              : row.loan_id,
      loanNumber          : row.loan_number,
      isRepeatLoan        : row.loan_repeat,
      loanFundAmount      : row.loan_amount ? formatToCurrency(row.loan_amount) : 0,
      memberName          : row.member_name,
      fundAmount          : row.loan_fundamount,
      fundMethod          : row.loan_fundmethod,
      loanTerm            : row.loan_term,
      loanRate            : row.loan_rate,
      loanStatus          : LOAN_STATUS_MAP[row.loan_status],
      loanCode            : row.loan_status,
      balance             : row.remainingBalance ? row.remainingBalance.toFixed(2) : 0,
      remainingPayments   : row.remainingPaymentsCount,
      email               : row.member_email,
      recovery            : row.loan_recovery,
      recoveryBalance     : row.loan_recoverybalance,
      judgement           : row.loan_judgement,
      loanFundDate,
      loanNoteDate,
      payoffDate,
      memberSsn,
      nextPaymentDate,
      refiDate,
      firstPaymentDate,
      defaultDate,
      manualDate,
      lateDate,
      recoveryDate,
      recoveryEndDate,
      paymentScheduleCode,
      paymentSchedule,
    }
  })
  return loanLevelResult.length > 0 ? loanLevelResult[0] : {}
}

async function getLoanChanges(loanId) {
  debug(`calling getLoanChanges for loan id ${loanId}`)

  const query = `
        select * from tbl_loanchanges where loanchange_loan = ?
        `
  const rows = await runParameterizedQuery({
    actionName      : 'getLoanChanges',
    paramValueList  : [loanId],
    query,
  })

  debug(`calling getLoan result ${JSON.stringify(rows)}`)
  return rows.map( (row) => {
    const changeDate = convertDateFormat(row.loanchange_date)
    const paymentDate = convertDateFormat(row.loanchange_paymentdate)
    debug(`looping result paymentDate ${paymentDate}`)
    return {
      loanId            : row.loanchange_loan,
      loanCode          : row.loanchange_status,
      loanStatus        : LOAN_STATUS_MAP[row.loanchange_status],
      paymentSchedule   : PAYMENT_SCHEDULE_MAPPING[row.loanchange_paymentschedule],
      balance           : row.loanchange_balance ? row.loanchange_balance.toFixed(2) : 0,
      interestRate      : row.loanchange_rate,
      payment           : row.loanchange_payment,
      term              : row.loanchange_term,
      changeDate,
      paymentDate,
    }
  })
}