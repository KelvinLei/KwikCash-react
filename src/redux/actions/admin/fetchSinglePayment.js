import { fetchSinglePayment } from '../../../api/adminApiClient'

export const FETCH_SINGLE_PAYMENT_REQUEST = 'FETCH_SINGLE_PAYMENT_REQUEST'
export const FETCH_SINGLE_PAYMENT_SUCCESS = 'FETCH_SINGLE_PAYMENT_SUCCESS'
export const FETCH_SINGLE_PAYMENT_FAILURE = 'FETCH_SINGLE_PAYMENT_FAILURE'

export const fetchSinglePaymentAction = (paymentId) => {
  return (dispatch, getState) => {
    dispatch(fetchSinglePaymentRequest())

    fetchSinglePayment(paymentId)
      .then(response => {
        dispatch(fetchSinglePaymentSuccess(response.payment))
      })
      .catch(() => {
        console.log(`failed to fetchSinglePaymentAction paymentId ${paymentId}`)
        dispatch(fetchSinglePaymentError())
      })
  }
}

export const fetchSinglePaymentRequest = () => {
  return {
    type: FETCH_SINGLE_PAYMENT_REQUEST
  }
}

export const fetchSinglePaymentSuccess = (payment) => {
  return {
    type: FETCH_SINGLE_PAYMENT_SUCCESS,
    payment: payment,
  }
}

export const fetchSinglePaymentError = () => {
  return {
    type: FETCH_SINGLE_PAYMENT_FAILURE
  }
}