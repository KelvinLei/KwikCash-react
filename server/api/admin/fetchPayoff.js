import { fetchPayoffQuery } from './database-proxy'
import _debug from 'debug'
import {convertDateFormat} from "../shared/dateHelper";

const debug = _debug('app:server:admin:api:fetchPayoff')

export async function fetchPayoff(loanId) {
  debug("calling fetchPayoff id " + loanId);

  const rows = await fetchPayoffQuery(loanId)
  const payoffData = getPayoffData(rows)
  const { balanceFromLastPayment, lastPaymentDate, interestFromNextPayment } = payoffData

  const payoffAmountList = []
  const daysBetweenNowAndLastPayment = getDaysDiff(new Date(), lastPaymentDate)
  for (var i = 0; i < 31; i++) {
    let payoffInterest, payoffAmount = 0
    const payoffDate = addDaysToDate(new Date(), i)

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

const getDaysDiff = (day1, day2) => {
  var _MS_PER_DAY = 1000 * 60 * 60 * 24;

  // Discard the time and time-zone information.
  var utc1 = Date.UTC(day1.getFullYear(), day1.getMonth(), day1.getDate());
  var utc2 = Date.UTC(day2.getFullYear(), day2.getMonth(), day2.getDate());

  return Math.abs(Math.floor((utc2 - utc1) / _MS_PER_DAY));
}

const addDaysToDate = ( date, days ) => {
  let result = new Date()
  result.setDate(date.getDate() + days)
  return result
}