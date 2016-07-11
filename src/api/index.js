import 'whatwg-fetch'


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

export const getLoanList = () => {
  return authenticatedPost('/api/loanlist')
}

export const getPayments = (loanId) => {
  return authenticatedPost('/api/loanlist', {
    loanId
  })
}
