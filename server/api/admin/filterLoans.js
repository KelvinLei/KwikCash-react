import { filterLoansQuery } from './database-proxy'
import _debug from 'debug'
import { LOAN_STATUS_MAP } from '../shared/loansConstants'
import {decrypt} from "../shared/decrypter";
import {convertDateFormat} from "../shared/dateHelper";

const debug = _debug('app:server:admin:api:filterLoans')

const formatToCurrency = (num) => {
  return Number(num).toFixed(2)
}

export async function filterLoans(filterContext) {

  var rows = await filterLoansQuery(filterContext)

  const loanListResult = rows.map( (row) => {
    let address
    if (filterContext.addressWanted == true) {
      const streetNum = decrypt(row.hstnum.toString())
      const streetName = decrypt(row.hstname.toString())
      const aptNum = decrypt(row.haptnum.toString())
      const zip = decrypt(row.hzip.toString())
      const city = decrypt(row.hcity.toString())
      address = `${streetNum} ${streetName} ${aptNum} ${city} ${row.hstate}, ${zip}`
    }

    const loanFundDate = convertDateFormat(row.loan_funddate)
    const loanNoteDate = convertDateFormat(row.loan_notedate)
    const payoffDate = convertDateFormat(row.lastPaymentDateForPaidLoan)
    const recoveryDate = convertDateFormat(row.loan_recoveryDate)
    const defaultDate = convertDateFormat(row.loan_defaultdate)

    return {
      loanId              : row.loan_id,
      loanNumber          : row.loan_number,
      loanFundAmount      : formatToCurrency(row.loan_amount),
      firstName           : row.fname,
      lastName            : row.lname,
      state               : row.hstate,
      loanRate            : row.loan_rate,
      loanStatus          : LOAN_STATUS_MAP[row.loan_status],
      loanCode            : row.loan_status,
      balance             : row.remainingBalance && row.remainingBalance.toFixed(2),
      remainingPayments   : row.remainingPaymentsCount,
      address             : address,
      email               : row.email,
      recoveryBalance     : row.loan_recoveryBalance,
      judgement           : row.loan_judgement,
      loanFundDate,
      loanNoteDate,
      defaultDate,
      payoffDate,
      recoveryDate,
    }
  })

  return loanListResult
}