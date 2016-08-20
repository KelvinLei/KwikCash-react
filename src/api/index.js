import 'whatwg-fetch'

export const METRICS_NAME_PROMO_CODE = 'promotionCodeLinkCount'

const authenticatedPost = (url, input) => {
  var token = localStorage.getItem('user_token')
  return fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization' : `Bearer ${token}`
    },
    body: JSON.stringify(input)
  }).then((response) => {
    if (response.status == 200) {
      return response;
    } else {
      var error = new Error(response.statusText)
      error.response = response
      throw error
    }
  }).then((response) => {
    return response.json()
  })
}

export const authenticate = (username, password) => {
  return authenticatedPost('/api/authenticate', {
    username,
    password,
  })
}

// just clear the token
export const logout = () => {
  localStorage.user_token = ""
}

export const getUser = () => {
  return authenticatedPost('/api/user')
}

export const getUserData = () => {
  return authenticatedPost('/api/userdata')
}

export const getLoanList = () => {
  return authenticatedPost('/api/loanlist')
}

export const getPayments = (loanId) => {
  return authenticatedPost('/api/payments', {
    loanId
  })
}

export const sendPayoffRequest = (loanId) => {
  return authenticatedPost('/api/email/payoff', {
    loanId,
  })
}

export const sendRefinanceRequest = (loanId, currentBalance, refinanceAmount) => {
  return authenticatedPost('/api/email/refinance', {
    loanId,
    currentBalance,
    refinanceAmount
  })
}

export const sendReferalRequest = (referalEmail) => {
  return authenticatedPost('/api/email/referal', {
    referalEmail,
  })
}

export const sendCounterMetrics = (metricsName, value) => {
  console.log(`emitting metrics ${metricsName} ${value}`)
  // TODO
  // return authenticatedPost('/api/metrics/counter', {
  //   metricsName,
  //   value
  // })
}
