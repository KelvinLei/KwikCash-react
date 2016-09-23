import { filterLoansQuery } from './database-proxy'
import _debug from 'debug'
import { LOAN_STATUS_MAP } from '../shared/loansConstants'
import {decrypt} from "../shared/decrypter";

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

    const loanFundDate = row.loan_funddate && new Date(row.loan_funddate).toISOString().slice(0, 10)
    const loanNoteDate = row.loan_notedate && new Date(row.loan_notedate).toISOString().slice(0, 10)
    const defaultDate = row.loan_defaultdate && (new Date(row.loan_defaultdate) > new Date('2002'))
                        ? row.loan_defaultdate
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
      loanRate: row.loan_rate.toFixed(2),
      loanStatus : LOAN_STATUS_MAP[row.loan_status],
      loanCode: row.loan_status,
      balance: row.remainingBalance,
      remainingPayments: row.remainingPaymentsCount,
      address: address,
      email: row.email,
      defaultDate,
      payoffDate: row.lastPaymentDateForPaidLoan
    }
  })

  return loanListResult
}