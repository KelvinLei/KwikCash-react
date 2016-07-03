import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILED } from '../../actions/login'

const loginState = (state ={
        isFetching: false,
        isAuthenticated: false,
        loginFailed: false
    }, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case LOGIN_SUCCESS:
    case LOGIN_FAILED:
      return {
        ...state,
        isFetching: action.isFetching,
        isAuthenticated: action.isAuthenticated,
        loginFailed: action.loginFailed,
      }
    default:
      return state
  }
}

export default {
  loginState
}
