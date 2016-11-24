import { runParameterizedQuery
} from './../database-proxy'
import _debug from 'debug'
var moment = require('moment')

const debug = _debug('app:server:admin:paymentShifter')

/**
 * map each payment schedule to a fucction.
 * Each function takes in a moment date object and returns the next moment date object
 */
const MAP_SCHEDULE_TO_NEXT_DATE_FUNCTION = {
  "M"     : ( date ) => { return date.add(1, 'months') }, // "Monthly"
  "4"     : ( date ) => { return date.add(4, 'weeks') }, // "Every 4 Weeks"
  "4n"    : ( date ) => { return date.add(4, 'weeks') }, // "Every 4 Weeks",
  "W"     : ( date ) => { return date.add(4, 'weeks') }, // "Every 4 Weeks",
  "last"  : ( date ) => { return date.add(1, 'months').endOf('month') }, // "Last Day of the Month",
  "2"     : ( date ) => { return date.add(2, 'weeks') }, // "Every 2 weeks",
  "2n"    : ( date ) => { return date.add(2, 'weeks') }, // "Every 2 weeks",
  "272"   : ( date ) => { return date.add(2, 'weeks') }, // "Every 2 weeks",
  "1"     : ( date ) => { return date.add(1, 'weeks') }, // "Every week",
  "5th"   : ( date ) => {
    return date.date() == 5 ? date.date(20) : date.add(1, 'months').date(5)
  }, // "Every 5th/20th",
  "10th"  : ( date ) => {
    return date.date() == 10 ? date.date(25) : date.add(1, 'months').date(10)
  }, // "Every 10th/25th",
  "15th"  : ( date ) => {
    return date.date() == 15 ? date.endOf('month') : date.add(1, 'months').date(15)
  }, // "Every 15th/Last Day",
  "16th"  : ( date ) => {
    return date.date() == 1 ? date.date(16) : date.add(1, 'months').date(1)
  }, // "Every 1st/16th",
}

const MAP_SCHEDULE_TO_PREV_DATE_FUNCTION = {
  "M"     : ( date ) => { return date.subtract(1, 'months') }, // "Monthly"
  "4"     : ( date ) => { return date.subtract(4, 'weeks') }, // "Every 4 Weeks"
  "4n"    : ( date ) => { return date.subtract(4, 'weeks') }, // "Every 4 Weeks",
  "W"     : ( date ) => { return date.subtract(4, 'weeks') }, // "Every 4 Weeks",
  "last"  : ( date ) => { return date.subtract(1, 'months').endOf('month') }, // "Last Day of the Month",
  "2"     : ( date ) => { return date.subtract(2, 'weeks') }, // "Every 2 weeks",
  "2n"    : ( date ) => { return date.subtract(2, 'weeks') }, // "Every 2 weeks",
  "272"   : ( date ) => { return date.subtract(2, 'weeks') }, // "Every 2 weeks",
  "1"     : ( date ) => { return date.subtract(1, 'weeks') }, // "Every week",
  "5th"   : ( date ) => {
    return date.date() == 5 ? date.subtract(1, 'months').date(20) : date.date(5)
  }, // "Every 5th/20th",
  "10th"  : ( date ) => {
    return date.date() == 10 ? date.subtract(1, 'months').date(25) : date.date(10)
  }, // "Every 10th/25th",
  "15th"  : ( date ) => {
    return date.date() == 15 ? date.subtract(1, 'months').endOf('month') : date.date(15)
  }, // "Every 15th/Last Day",
  "16th"  : ( date ) => {
    return date.date() == 1 ? date.subtract(1, 'months').date(16) : date.date(1)
  }, // "Every 1st/16th",
}

export async function shiftFuturePaymentsToNextDate({
  loanId,
  paymentDate,
}) {
  debug(`shiftFuturePaymentsToNextDate loanId: ${loanId} paymentDate ${paymentDate}`)

  // fetch all payments that are due after current payment date
  const futurePayments = await fetchFuturePayments(loanId, paymentDate)

  // shift all payments date down by one pay cycle
  const shiftedPayments = await shiftPaymentsByOnePayCycle({
    futurePayments,
    isShiftToNextDate : true,
  })

  // update database with the new paydate
  await shiftPaymentsInDB(shiftedPayments)
}

export async function shiftFuturePaymentsToPrevDate({
  loanId,
  paymentDate,
}) {
  debug(`shiftFuturePaymentsToPrevDate loanId: ${loanId} paymentDate ${paymentDate}`)

  // fetch all payments that are due after current payment date
  const futurePayments = await fetchFuturePayments(loanId, paymentDate)

  // shift all payments date up by one pay cycle
  const shiftedPayments = await shiftPaymentsByOnePayCycle({
    futurePayments,
    isShiftToNextDate : false,
  })

  // update database with the new paydate
  await shiftPaymentsInDB(shiftedPayments)
}

async function fetchFuturePayments(loanId, paymentDate) {
  const query = `
          SELECT *, DATE_FORMAT(loanpayment_date, '%Y-%m-%d') as paymentDate
          FROM tbl_loanpayments
          WHERE
          loanpayment_loan = ? AND loanpayment_date >= ?
          ORDER BY loanpayment_date
  `
  return await runParameterizedQuery({
    actionName      : 'fetchFuturePayments',
    paramValueList  : [loanId, paymentDate],
    query,
  })
}

async function shiftPaymentsByOnePayCycle({
  futurePayments,
  isShiftToNextDate, // true for shifting to next date, false of shifting to prev date
}) {
  const scheduleToDateFuncMap = isShiftToNextDate ?
                                MAP_SCHEDULE_TO_NEXT_DATE_FUNCTION :
                                MAP_SCHEDULE_TO_PREV_DATE_FUNCTION

  const shiftedPayments = futurePayments.map( (payment) => {
    // calculate new date, either next date or prev date, format it to YYYY MM DD
    const currDate = moment(payment.paymentDate)
    const calculateDateFunc = scheduleToDateFuncMap[payment.loanpayment_paymentschedule]
    const newDate = calculateDateFunc(currDate)
    const newDateFormated = newDate.format('YYYY-MM-DD')

    return {
      ...payment,
      nextPaymentDate : newDateFormated,
    }
  })

  return shiftedPayments
}

async function shiftPaymentsInDB(shiftedPayments) {
  const paymentIdsString = createPaymentIdsString(shiftedPayments)

  const whereCaseClause = shiftedPayments.reduce( (prev, curr) => {
    return `${prev}
            WHEN loanpayment_id = ${curr.loanpayment_id} THEN '${curr.nextPaymentDate}'
          `
  }, '')

  const query = `
    UPDATE tbl_loanpayments SET loanpayment_date = 
    CASE
    ${whereCaseClause}
    ELSE loanpayment_date
    END
    WHERE loanpayment_id IN ${paymentIdsString}            
  `

  await runParameterizedQuery({
    actionName      : 'shiftPaymentsInDB',
    paramValueList  : [],
    query,
  })
}

/**
 * returns a string contains all payments ids in format of
 * (1, 2, 3, 4, 5)
 */
function createPaymentIdsString(payments) {
  const result = payments.reduce( (prev, curr) => {
    return prev + ' ' + curr.loanpayment_id + ','
  }, '(')

  // remove last comma and append )
  return result.slice(0, -1) + ')'
}
