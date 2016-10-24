import { editPayment } from '../../../api/adminApiClient'

export const EDIT_PAYMENT_REQUEST = 'EDIT_PAYMENT_REQUEST'
export const EDIT_PAYMENT_SUCCESS = 'EDIT_PAYMENT_SUCCESS'
export const EDIT_PAYMENT_FAILURE = 'EDIT_PAYMENT_FAILURE'
export const RESET_EDIT_PAYMENT_STATE = 'RESET_EDIT_PAYMENT_STATE'

export const editPaymentAction = (editPaymentContext) => {
  return (dispatch) => {
    dispatch(editPaymentRequest())

    editPayment(editPaymentContext)
      .then(response => {
        dispatch(editPaymentSuccess())
      })
      .catch(() => {
        console.log(`editPaymentAction failed " + ${JSON.stringify(editPaymentContext)}`)
        dispatch(editPaymentError())
      })
  }
}

export const editPaymentRequest = () => {
  return {
    type: EDIT_PAYMENT_REQUEST
  }
}

export const editPaymentSuccess = () => {
  return {
    type: EDIT_PAYMENT_SUCCESS,
  }
}

export const editPaymentError = () => {
  return {
    type: EDIT_PAYMENT_FAILURE
  }
}

export const resetEditPaymentAction = () => {
  return {
    type: RESET_EDIT_PAYMENT_STATE
  }
}