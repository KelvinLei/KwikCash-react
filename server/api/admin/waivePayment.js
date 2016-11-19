import { runParameterizedQuery
} from './database-proxy'
import _debug from 'debug'
var moment = require('moment')

const debug = _debug('app:server:admin:waivePayment')

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

export async function waivePayment(waivePaymentContext) {
  debug(`calling waivePayment ${JSON.stringify(waivePaymentContext)}`)

  const { paymentId, loanId, paymentDate, paymentSchedule } = waivePaymentContext

  // fetch all payments that are due after current payment date
  const futurePayments = await fetchFuturePayments(loanId, paymentDate)

  // shift all payments date down by one pay cycle
  const shiftedPayments = await shiftPaymentsByOnePayCycle(futurePayments, paymentSchedule)

  // update database with the new paydate
  await shiftPaymentsInDB(shiftedPayments)

  // waive the payment
  await waiveActualPayment(paymentId, paymentDate)
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

async function shiftPaymentsByOnePayCycle(futurePayments, paymentSchedule) {
  const shiftedPayments = futurePayments.map( (payment) => {
    const nextPaymentDate = calculateNextDate(payment.paymentDate, payment.loanpayment_paymentschedule)

    return {
      ...payment,
      nextPaymentDate : nextPaymentDate,
    }
  })

  return shiftedPayments
}

function calculateNextDate(paymentDate, paymentSchedule) {
  const currDate = moment(paymentDate)
  const calculateNextDateFunc = MAP_SCHEDULE_TO_NEXT_DATE_FUNCTION[paymentSchedule]
  const nextDate = calculateNextDateFunc(currDate)
  return nextDate.format('YYYY-MM-DD')
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

async function waiveActualPayment(paymentId, paymentDate) {
  const query = `
          INSERT INTO tbl_loanpayments (
            loanpayment_loan, loanpayment_date, loanpayment_due, loanpayment_amount,
            loanpayment_scheduled, loanpayment_interest, loanpayment_principal,
            loanpayment_rate, loanpayment_paymentschedule, loanpayment_type
          )
          SELECT
            loanpayment_loan, ?, 0, 0,
            'W', loanpayment_interest, loanpayment_principal,
            loanpayment_rate, loanpayment_paymentschedule, loanpayment_type
          FROM tbl_loanpayments
          WHERE loanpayment_id = ?
        `
  await runParameterizedQuery({
    actionName      : 'waiveActualPayment',
    paramValueList  : [paymentDate, paymentId],
    query,
  })
}