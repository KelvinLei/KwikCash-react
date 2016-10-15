import { fetchPayoffQuery } from './database-proxy'
import _debug from 'debug'
import {convertDateFormat} from "../shared/dateHelper";
var moment = require('moment')

const debug = _debug('app:server:admin:api:fetchPayoff')

export async function fetchPayoff(loanId) {
  debug("calling fetchPayoff id " + loanId);

  const rows = await fetchPayoffQuery(loanId)
  const payoffData = getPayoffData(rows)
  const { balanceFromLastPayment, lastPaymentDate, interestFromNextPayment } = payoffData
  // debug(`payoffData ${JSON.stringify(payoffData)}`);

  const daysBetweenNowAndLastPayment = getDaysDiff(moment(), lastPaymentDate)
  // debug(`daysBetweenNowAndLastPayment ${daysBetweenNowAndLastPayment}`)

  const payoffAmountList = []
  for (var i = 0; i < 31; i++) {
    let payoffInterest, payoffAmount = 0
    const payoffDate = moment().add(i, 'day')

    if (rows[0].loan_status == 'P' || rows[0].loan_status == 'D') {
      payoffInterest = 0
      payoffAmount = 0
    }
    else {
      /*
       payoff interest =
       {remaining balance for last payment} * interest rate * {number of days until payoff since last payment} / 365

       payoff amount = {remaining balance for last payment} + {payoff payment interest}
       */
      const daysToAcountForPayoff = daysBetweenNowAndLastPayment + i

      payoffInterest = balanceFromLastPayment * (interestFromNextPayment/100) * daysToAcountForPayoff / 365
      payoffAmount = balanceFromLastPayment + payoffInterest
    }

    payoffAmountList.push({
      payoffDate: convertDateFormat(payoffDate),
      payoffInterest: payoffInterest.toFixed(2),
      payoffAmount: payoffAmount.toFixed(2)
    })
  }

  return {
    payoffData: {
      balanceFromLastPayment: balanceFromLastPayment.toFixed(2),
      lastPaymentDate: convertDateFormat(lastPaymentDate),
      interestFromNextPayment: interestFromNextPayment
    },
    payoffAmountList,
  }
}

export async function fetchPayoffForDate(loanId, payoffDate) {
  debug(`calling fetchPayoffForDate loanid ${loanId} payoff date ${payoffDate}`);
  const rows = await fetchPayoffQuery(loanId)
  const payoffData = getPayoffData(rows)
  const { balanceFromLastPayment, lastPaymentDate, interestFromNextPayment } = payoffData
  // debug(`payoffData ${JSON.stringify(payoffData)}`);

  const daysBetweenPayoffAndLastPayment = getDaysDiff(payoffDate, lastPaymentDate)
  // debug(`daysBetweenPayoffAndLastPayment ${daysBetweenPayoffAndLastPayment}`)

  let payoffInterest, payoffAmount
  if (rows[0].loan_status == 'P' || rows[0].loan_status == 'D') {
    payoffInterest = 0
    payoffAmount = 0
  }
  else {
    payoffInterest = balanceFromLastPayment * (interestFromNextPayment/100) * daysBetweenPayoffAndLastPayment / 365
    payoffAmount = balanceFromLastPayment + payoffInterest
  }

  return {
    balanceFromLastPayment    : balanceFromLastPayment.toFixed(2),
    lastPaymentDate           : convertDateFormat(lastPaymentDate),
    interestFromNextPayment   : interestFromNextPayment,
    payoffDate                : convertDateFormat(payoffDate),
    payoffInterest            : payoffInterest.toFixed(2),
    payoffAmount              : payoffAmount.toFixed(2),
  }
}

const getPayoffData = ( rows ) => {
  // if loan is paid or charged off
  if (rows[0].loan_status == 'P' || rows[0].loan_status == 'D') {
    return {
      balanceFromLastPayment: 0,
      lastPaymentDate: null,
      interestFromNextPayment: rows[0].loanpayment_rate
    }
  }

  let balanceFromLastPayment = rows[0].loan_amount
  const currentDate = new Date()
  // if loan is newly taken and has no paid payment yet
  if (rows[0].loanpayment_date >= currentDate && rows[0].loanpayment_due > rows[0].loanpayment_amount) {
    return {
      balanceFromLastPayment,
      lastPaymentDate: rows[0].loan_funddate, // use the initial fund date
      interestFromNextPayment: rows[0].loanpayment_rate
    }
  }

  let lastPaymentDate = new Date()
  let interestFromNextPayment = 0
  for (var i = 0; i < rows.length; i++) {
    // substract paid principal from loan amount
    const paymentDate = new Date(rows[i].loanpayment_date)

    // ensure amount due <= amount paid AND payment date <= current date AND payment is not a waived payment
    if (rows[i].loanpayment_due <= rows[i].loanpayment_amount
      && paymentDate <= currentDate
      && rows[i].loanpayment_scheduled != 'W'
    ) {
      balanceFromLastPayment -= rows[i].loanpayment_principal
      lastPaymentDate = paymentDate
    }

    if (paymentDate > currentDate) {
      interestFromNextPayment = rows[i].loanpayment_rate
      break
    }
  }
  return {
    balanceFromLastPayment,
    lastPaymentDate,
    interestFromNextPayment
  }
}

const getDaysDiff = (day1Raw, day2Raw) => {
  if (day1Raw == null || day2Raw == null) return 0
  var day1 = moment(day1Raw)
  var day2 = moment(day2Raw)

  // debug(`day1 ${day1.format()}`)
  // debug(`day2 ${day2.format()}`)

  return Math.abs(day1.diff(day2, 'days'))
}
