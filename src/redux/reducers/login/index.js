import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILED } from '../../actions/login'

const loginState = (state = { isFetching: false, isAuthenticated: false }, action) => {
  switch (action.type) {
    case LOGIN_REQUEST:
    case LOGIN_SUCCESS:
    case LOGIN_FAILED:
      return {
        ...state,
        isFetching: action.isFetching,
        isAuthenticated: action.isAuthenticated,
      }
    default:
      return state
  }
}

export default {
  loginState
}
