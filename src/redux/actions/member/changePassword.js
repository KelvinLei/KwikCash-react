import { changePasswordApi } from '../../../api/memberApiClient'

export const CHANGE_PASSWORD_REQUEST = 'CHANGE_PASSWORD_REQUEST'
export const CHANGE_PASSWORD_SUCCESS = 'CHANGE_PASSWORD_SUCCESS'
export const CHANGE_PASSWORD_FAILURE = 'CHANGE_PASSWORD_FAILURE'
export const INCORRECT_CURRENT_PASSWORD = 'INCORRECT_CURRENT_PASSWORD'
export const CHANGE_PASSWORD_RESET = 'CHANGE_PASSWORD_RESET'

export const changePasswordAction = (currPassword, newPassword) => {
  return (dispatch) => {
    dispatch(changePasswordRequest())

    changePasswordApi(currPassword, newPassword)
      .then(response => {
        const { isValidPassword } = response.changePasswordResult

        if (isValidPassword) {
          dispatch(changePasswordSuccess())
        } else {
          dispatch(incorrectCurrentPassword())
        }
      })
      .catch(() => {
        console.log("changePasswordAction failed")
        dispatch(changePasswordFailure())
      })
  }
}

export const changePasswordRequest = () => {
  return {
    type: CHANGE_PASSWORD_REQUEST
  }
}

export const changePasswordReset = () => {
  return {
    type: CHANGE_PASSWORD_RESET
  }
}

export const incorrectCurrentPassword = () => {
  return {
    type: INCORRECT_CURRENT_PASSWORD
  }
}

export const changePasswordSuccess = (userData) => {
  return {
    type: CHANGE_PASSWORD_SUCCESS,
    userData
  }
}

export const changePasswordFailure = () => {
  return {
    type: CHANGE_PASSWORD_FAILURE
  }
}
