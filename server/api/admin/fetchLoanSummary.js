import { fetchLoanSummaryQuery } from './database-proxy'
import _debug from 'debug'
import { LOAN_STATUS_MAP } from '../shared/loansConstants'
import {decrypt} from "../shared/decrypter";
import {getPayments} from "../members/payments";

const debug = _debug('app:server:admin:api:fetchLoanSummary')

const formatToCurrency = (num) => {
  return Number(num).toFixed(2)
}

export async function fetchLoanSummary(loanId) {
  const loanLevelData = await getLoanSummaryData(loanId)
  const paymentLevelData = await getPayments(loanId)

  return {
    loanLevelData,
    paymentLevelData,
  }
}

async function getLoanSummaryData(loanId) {
  const loanLevelDataRows = await fetchLoanSummaryQuery(loanId)

  const loanLevelResult = loanLevelDataRows.map( (row) => {
    const streetNum = decrypt(row.hstnum.toString())
    const streetName = decrypt(row.hstname.toString())
    const aptNum = decrypt(row.haptnum.toString())
    const zip = decrypt(row.hzip.toString())
    const city = decrypt(row.hcity.toString())
    const address = `${streetNum} ${streetName} ${aptNum} ${city} ${row.hstate}, ${zip}`

    const loanFundDate = row.loan_funddate && new Date(row.loan_funddate).toISOString().slice(0, 10)
    const loanNoteDate = row.loan_notedate && new Date(row.loan_notedate).toISOString().slice(0, 10)
    const recoveryDate = row.loan_recoveryDate && (new Date(row.loan_recoveryDate) > new Date('2002'))
      ? new Date(row.loan_recoveryDate).toISOString().slice(0, 10)
      : ''
    const defaultDate = row.loan_defaultdate && (new Date(row.loan_defaultdate) > new Date('2002'))
      ? new Date(row.loan_defaultdate).toISOString().slice(0, 10)
      : ''
    const nextPaymentDate = row.nextPaymentDate && (new Date(row.nextPaymentDate) > new Date('2002'))
      ? new Date(row.nextPaymentDate).toISOString().slice(0, 10)
      : ''

    return {
      loanId : row.loan_id,
      loanNumber : row.loan_number,
      loanFundAmount: formatToCurrency(row.loan_amount),
      firstName : row.fname,
      lastName : row.lname,
      state : row.hstate,
      loanFundDate,
      loanNoteDate,
      nextPaymentDate,
      loanRate: row.loan_rate.toFixed(2),
      loanStatus : LOAN_STATUS_MAP[row.loan_status],
      loanCode: row.loan_status,
      balance: row.remainingBalance,
      remainingPayments: row.remainingPaymentsCount,
      address: address,
      email: row.email,
      defaultDate,
      recoveryDate,
      recoveryBalance: row.loan_recoveryBalance,
      judgement: row.loan_judgement,
    }
  })
  return loanLevelResult.length > 0 ? loanLevelResult[0] : {}
}
