import { waivePayment } from '../../../api/adminApiClient'
import {fetchLoanSummaryAction} from "./fetchLoanSummary";

export const WAIVE_PAYMENT_REQUEST = 'WAIVE_PAYMENT_REQUEST'
export const WAIVE_PAYMENT_SUCCESS = 'WAIVE_PAYMENT_SUCCESS'
export const WAIVE_PAYMENT_FAILURE = 'WAIVE_PAYMENT_FAILURE'
export const RESET_WAIVE_PAYMENT_STATE = 'RESET_WAIVE_PAYMENT_STATE'

export const waivePaymentAction = (waivePaymentContext) => {
  return (dispatch) => {
    dispatch(waivePaymentRequest(waivePaymentContext.paymentId))

    waivePayment(waivePaymentContext)
      .then(response => {
        dispatch(resetWaivePaymentState())
        dispatch(fetchLoanSummaryAction(waivePaymentContext.loanId))
      })
      .catch(() => {
        console.log(`waivePaymentAction failed payment id ${waivePaymentContext.paymentId} loan id ${waivePaymentContext.loanId}`)
        dispatch(waivePaymentFailure(waivePaymentContext.paymentId))
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