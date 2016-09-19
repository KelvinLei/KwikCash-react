import { authenticate } from '../../../api'
import { adminAuthenticate } from '../../../api/admin'

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILED = 'LOGIN_FAILED';

export const login = (userName, password, isAdmin) => {
  return (dispatch) => {
    dispatch(loginRequest())

    const authFn = isAdmin ? adminAuthenticate : authenticate
    const tokenKey = isAdmin ? 'admin_user_token' : 'user_token'
    authFn(userName, password)
      .then(user => {
        localStorage.setItem(tokenKey, user.token)
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
