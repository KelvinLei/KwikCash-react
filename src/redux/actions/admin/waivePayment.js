import { waivePayment } from '../../../api/adminApiClient'
import {fetchLoanSummaryAction} from "./fetchLoanSummary";

export const WAIVE_PAYMENT_REQUEST = 'WAIVE_PAYMENT_REQUEST'
export const WAIVE_PAYMENT_SUCCESS = 'WAIVE_PAYMENT_SUCCESS'
export const WAIVE_PAYMENT_FAILURE = 'WAIVE_PAYMENT_FAILURE'
export const RESET_WAIVE_PAYMENT_STATE = 'RESET_WAIVE_PAYMENT_STATE'

export const waivePaymentAction = (paymentId, loanId) => {
  return (dispatch) => {
    dispatch(waivePaymentRequest(paymentId))

    waivePayment(paymentId)
      .then(response => {
        dispatch(resetWaivePaymentState())
        dispatch(fetchLoanSummaryAction(loanId))
      })
      .catch(() => {
        console.log(`waivePaymentAction failed payment id ${paymentId} loan id ${loanId}`)
        dispatch(waivePaymentFailure(paymentId))
      })
  }
}

export const waivePaymentRequest = (paymentId) => {
  return {
    type: WAIVE_PAYMENT_REQUEST,
    paymentId,
  }
}

export const waivePaymentSuccess = () => {
  return {
    type: WAIVE_PAYMENT_SUCCESS,
  }
}

export const waivePaymentFailure = (paymentId) => {
  return {
    type: WAIVE_PAYMENT_FAILURE,
    paymentId,
  }
}

export const resetWaivePaymentState = () => {
  return {
    type: RESET_WAIVE_PAYMENT_STATE
  }
}