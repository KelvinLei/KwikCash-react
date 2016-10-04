import { fetchPayoffQuery } from './database-proxy'
import _debug from 'debug'

const debug = _debug('app:server:admin:api:fetchPayoff')

export async function fetchPayoff(loanId) {
  debug("calling fetchPayoff id " + loanId);

  const rows = await fetchPayoffQuery(loanId)
  const payoffData = getPayoffData(rows)
  const { balanceFromLastPayment, lastPaymentDate, interestFromNextPayment } = payoffData

  const payoffAmountList = []
  for (var i = 0; i < 31; i++) {
    let payoffInterest, payoffAmount = 0
    const payoffDate = addDaysToDate(new Date(), i).toISOString().slice(0, 10)

    if (rows[0].loan_status == 'P' || rows[0].loan_status == 'D') {
      payoffInterest = 0
      payoffAmount = 0
    }
    else {
      /*
       payoff payment interest =
       {remaining balance for last payment} * interest rate * {number of days until payoff since last payment} / 365

       payoff amount = {remaining balance for last payment} + {payoff payment interest}
       */
      const daysBetweenNowAndLastPayment = getDaysDiff(new Date(), lastPaymentDate)
      const daysToAcountForPayoff = daysBetweenNowAndLastPayment + i

      payoffInterest = balanceFromLastPayment * (interestFromNextPayment/100) * daysToAcountForPayoff / 365
      payoffAmount = balanceFromLastPayment + payoffInterest

      payoffInterest = payoffInterest.toFixed(2)
      payoffAmount = payoffAmount.toFixed(2)
    }

    payoffAmountList.push({
      payoffDate,
      payoffInterest,
      payoffAmount,
    })
  }

  return {
    payoffData: {
      balanceFromLastPayment,
      lastPaymentDate: lastPaymentDate && lastPaymentDate.toISOString().slice(0, 10),
      interestFromNextPayment: interestFromNextPayment.toFixed(2)
    },
    payoffAmountList,
  }
}

const getPayoffData = ( rows ) => {
  if (rows[0].loan_status == 'P' || rows[0].loan_status == 'D') {
    return {
      balanceFromLastPayment: 0,
      lastPaymentDate: null,
      interestFromNextPayment: rows[0].loanpayment_rate
    }
  }

  let balanceFromLastPayment = rows[0].loan_fundamount
  let lastPaymentDate = new Date()
  let interestFromNextPayment = 0
  for (var i = 0; i < rows.length; i++) {
    // substract paid principal from loan amount
    const paymentDate = new Date(rows[i].loanpayment_date)
    const currentDate = new Date()
    if (rows[i].loanpayment_due <= rows[i].loanpayment_amount && paymentDate < currentDate) {
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
  var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds

  return Math.round(Math.abs((day1.getTime() - day2.getTime())/(oneDay)));
}

const addDaysToDate = ( date, days ) => {
  let result = new Date()
  result.setDate(result.getDate() + days)
  return result
}