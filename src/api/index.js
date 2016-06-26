import 'whatwg-fetch'

export const authenticate = (username, password) => {
  return fetch('/api/authenticate', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      password,
    })
  })
}
