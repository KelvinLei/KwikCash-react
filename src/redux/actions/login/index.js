import { authenticate } from '../../../api'

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILED = 'LOGIN_FAILED';

export const login = (userName, password) => {
  return (dispatch) => {
    dispatch(loginRequest())
    
    authenticate(userName, password)
      .then(user => {
        localStorage.setItem('user_token', user.token)
        dispatch(loginSuccess())
      })
      .catch(() => {
        dispatch(loginFailed())
      })
  }
}

export const loginRequest = () => {
  return {
    type: LOGIN_REQUEST,
    isFetching: true,
    isAuthenticated: false,
    loginFailed: false,
  }
}

export const loginSuccess = () => {
  return {
    type: LOGIN_SUCCESS,
    isFetching: false,
    isAuthenticated: true,
    loginFailed: false,
  }
}

export const loginFailed = () => {
  return {
    type: LOGIN_FAILED,
    isFetching: false,
    isAuthenticated: false,
    loginFailed: true,
  }
}
