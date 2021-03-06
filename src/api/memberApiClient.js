import 'whatwg-fetch'

export const METRICS_NAME_PROMO_CODE = 'promotionCodeLinkCount'
export const METRICS_NAME_MEMBER_LOGIN_SUCCESS = 'successMemberLoginCount'
export const METRICS_NAME_PAYOFF_BTN_COUNT = 'payoffButtonClickCount'
export const METRICS_NAME_REFINANCE_BTN_COUNT = 'refinanceButtonClickCount'
export const METRICS_NAME_REAPPLY_BTN_COUNT = 'reapplyButtonClickCount'

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

// todo: share code with above authenticated post - had to do this in a rush due to production issue
const unauthenticatedPost = (url, input) => {
  var token = localStorage.getItem('user_token')
  return fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
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
  return unauthenticatedPost('/api/authenticate', {
    username,
    password,
  })
}

export const changePasswordApi = (currentPassword, newPassword) => {
  return authenticatedPost('/api/changePassword', {
    currentPassword,
    newPassword,
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

export const getLastApplication = () => {
  return authenticatedPost('/api/getLastApplication')
}

export const submitReapply = (reapplyInput) => {
  return authenticatedPost('/api/submitReapply', {
    reapplyInput
  })
}

export const sendPayoffRequest = (loanId) => {
  return authenticatedPost('/api/email/payoff', {
    loanId,
  })
}

export const sendReapplyRequest = () => {
  return authenticatedPost('/api/email/reapply')
}

export const sendRefinanceRequest = (loanId, currentBalance, refinanceAmount) => {
  return authenticatedPost('/api/email/refinance', {
    loanId,
    currentBalance,
    refinanceAmount
  })
}

export const sendReferalRequest = (referalEmail, referalName) => {
  return authenticatedPost('/api/email/referal', {
    referalEmail,
    referalName
  })
}

/**
 * @param metricsName
 * @param dimensions
 * A dimension is a name/value pair that helps you to uniquely identify a metric.
 * Every metric has specific characteristics that describe it,
 * and you can think of dimensions as categories for those characteristics.
 * Dimensions help you design a structure for your statistics plan.
 * Because dimensions are part of the unique identifier for a metric,
 * whenever you add a unique name/value pair to one of your metrics, you are creating a new metric.
 */
export const sendCounterMetrics = (metricsName, dimensions) => {
  console.log(`emitting metrics ${metricsName}`)
  return authenticatedPost('/api/metrics/counter', {
    metricsName
  })
}

export const sendLog = (message, type = 'DEBUG') => {
  console.log(`emitting log: [${type}] ${message}`)
  return authenticatedPost('/api/log', {
    message,
    type
  })
}
