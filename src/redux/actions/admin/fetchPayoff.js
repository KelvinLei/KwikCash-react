import { fetchPayoffAmount } from '../../../api/adminApiClient'

export const FETCH_PAYOFF_REQUEST = 'FETCH_PAYOFF_REQUEST'
export const FETCH_PAYOFF_SUCCESS = 'FETCH_PAYOFF_SUCCESS'
export const FETCH_PAYOFF_FAILURE = 'FETCH_PAYOFF_FAILURE'

export const fetchPayoffAction = (loanId) => {
  return (dispatch) => {
    dispatch(fetchPayoffRequest())

    fetchPayoffAmount(loanId)
      .then(response => {
        dispatch(fetchPayoffSuccess(response.payoff))
      })
      .catch(() => {
        console.log("fetchPayoffAction failed " + loanId)
        dispatch(fetchPayoffError())
      })
  }
}

export const fetchPayoffRequest = () => {
  return {
    type: FETCH_PAYOFF_REQUEST
  }
}

export const fetchPayoffSuccess = (payoff) => {
  return {
    type: FETCH_PAYOFF_SUCCESS,
    payoff: payoff,
  }
}

export const fetchPayoffError = () => {
  return {
    type: FETCH_PAYOFF_FAILURE
  }
}