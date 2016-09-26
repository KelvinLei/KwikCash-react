import 'whatwg-fetch'

const authenticatedPost = (url, input) => {
  var token = localStorage.getItem('admin_user_token')
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

const authenticatedPostForExcel = (url, input) => {
  var token = localStorage.getItem('admin_user_token')
  return fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/vnd.openxmlformats',
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
    return response.blob()
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
  return authenticatedPostForExcel('/api/admin/exportLoans', {filterContext})
}

export const fetchMembers = (memberName) => {
  return authenticatedPost('/api/admin/fetchMembers', {memberName})
}
