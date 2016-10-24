import { deletePayment } from '../../../api/adminApiClient'
import {fetchLoanSummaryAction} from "./fetchLoanSummary";

export const DELETE_PAYMENT_REQUEST = 'DELETE_PAYMENT_REQUEST'
export const DELETE_PAYMENT_SUCCESS = 'DELETE_PAYMENT_SUCCESS'
export const DELETE_PAYMENT_FAILURE = 'DELETE_PAYMENT_FAILURE'
export const RESET_DELETE_PAYMENT_STATE = 'RESET_DELETE_PAYMENT_STATE'

export const deletePaymentAction = (paymentId, loanId) => {
  return (dispatch) => {
    dispatch(deletePaymentRequest(paymentId))

    deletePayment(paymentId)
      .then(response => {
        dispatch(resetDeletePaymentState())
        dispatch(fetchLoanSummaryAction(loanId))
      })
      .catch(() => {
        console.log("deletePaymentAction failed " + JSON.stringify(paymentId))
        dispatch(deletePaymentFailure(paymentId))
      })
  }
}

export const deletePaymentRequest = (paymentId) => {
  return {
    type: DELETE_PAYMENT_REQUEST,
    paymentId,
  }
}

export const deletePaymentSuccess = () => {
  return {
    type: DELETE_PAYMENT_SUCCESS,
  }
}

export const deletePaymentFailure = (paymentId) => {
  return {
    type: DELETE_PAYMENT_FAILURE,
    paymentId,
  }
}

export const resetDeletePaymentState = () => {
  return {
    type: RESET_DELETE_PAYMENT_STATE
  }
}