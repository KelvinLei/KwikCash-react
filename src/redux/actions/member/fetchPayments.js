import { getPayments } from '../../../api/memberApiClient'

export const FETCH_PAYMENTS_REQUEST = 'FETCH_PAYMENTS_REQUEST'
export const FETCH_PAYMENTS_SUCCESS = 'FETCH_PAYMENTS_SUCCESS'
export const FETCH_PAYMENTS_ERROR = 'FETCH_PAYMENTS_ERROR'

/*
 Fetch payments if no data has been cached
 */
export const fetchPaymentsAction = (loanId) => {
  return (dispatch, getState) => {
    const state = getState()

    // only makes the api call when no data is cached
    // if (!state.paymentState.isFetching && !state.paymentState.paymentsDataMap.has(loanId)) {
    dispatch(fetchPaymentsRequest())

    getPayments(loanId)
      .then(response => {
        dispatch(fetchPaymentsSuccess(loanId, response.payments, response.paymentSchedule, response.interestRate))
      })
      .catch(() => {
        console.log("fetch payments for loan id " + loanId + " failed")
        dispatch(fetchPaymentsError())
      })
    // }
  }
}

export const fetchPaymentsRequest = () => {
  return {
    type: FETCH_PAYMENTS_REQUEST
  }
}

export const fetchPaymentsSuccess = (loanId, payments, paymentSchedule, interestRate) => {
  return {
    type: FETCH_PAYMENTS_SUCCESS,
    payments: payments,
    loanId: loanId,
    paymentSchedule: paymentSchedule,
    interestRate: interestRate
  }
}

export const fetchPaymentsError = () => {
  return {
    type: FETCH_PAYMENTS_ERROR
  }
}