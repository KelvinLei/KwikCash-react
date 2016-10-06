import 'whatwg-fetch'

var JSON_TYPE = 'json'
var WORD = 'word'
var EXCEL = 'excel'

var ACCEPT_TYPE_MAP = {
  'json' : 'application/json',
  'word' : 'application/vnd.ms-word',
  'excel' : 'application/vnd.openxmlformats',
}

const authenticatedPost = (url, input, acceptType = JSON_TYPE) => {
  var token = localStorage.getItem('admin_user_token')
  var acceptTypePost = ACCEPT_TYPE_MAP[acceptType]

  return fetch(url, {
    method: 'POST',
    headers: {
      'Accept': acceptTypePost,
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
    if (acceptType == WORD || acceptType == EXCEL) {
      return response.blob()
    } else {
      return response.json()
    }
  })
}

// todo: share code with above authenticated post - had to do this in a rush due to production issue
const unauthenticatedPost = (url, input) => {
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

export const adminAuthenticate = (username, password) => {
  return unauthenticatedPost('/api/admin/authenticate', {
    username,
    password,
  })
}

// just clear the token
export const adminLogout = () => {
  localStorage.admin_user_token = ""
}

export const getUser = () => {
  return authenticatedPost('/api/admin/user')
}

export const filterLoans = (filterContext) => {
  return authenticatedPost('/api/admin/filterLoans', {filterContext})
}

export const exportLoans = (filterContext) => {
  return authenticatedPost('/api/admin/exportLoans', {filterContext}, EXCEL)
}

export const fetchMembers = (memberName) => {
  return authenticatedPost('/api/admin/fetchMembers', {memberName})
}

export const fetchMemberLoans = (memberId) => {
  return authenticatedPost('/api/admin/fetchMemberLoans', {memberId})
}

export const fetchLoanSummary = (loanId) => {
  return authenticatedPost('/api/admin/fetchLoanSummary', {loanId})
}

export const fetchPayoffAmount = (loanId) => {
  return authenticatedPost('/api/admin/fetchPayoff', {loanId})
}

export const getPayoffAuthorization = (loanId) => {
  return authenticatedPost('/api/admin/payoffAuthorization', {loanId}, WORD)
}