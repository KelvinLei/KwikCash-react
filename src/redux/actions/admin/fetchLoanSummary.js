import { fetchLoanSummary } from '../../../api/adminApiClient'

export const FETCH_LOAN_SUMMARY_REQUEST = 'FETCH_LOAN_SUMMARY_REQUEST'
export const FETCH_LOAN_SUMMARY_SUCCESS = 'FETCH_LOAN_SUMMARY_SUCCESS'
export const FETCH_LOAN_SUMMARY_FAILURE = 'FETCH_LOAN_SUMMARY_FAILURE'

export const fetchLoanSummaryAction = (loanId) => {
  return (dispatch, getState) => {
    const state = getState()

    dispatch(fetchLoanSummaryRequest())

    fetchLoanSummary(loanId)
      .then(response => {
        dispatch(fetchLoanSummarySuccess(response.loanSummary))
      })
      .catch(() => {
        console.log("fetch fetchLoanSummaryQuery, loan id " + loanId)
        dispatch(fetchLoanSummaryError())
      })
  }
}

export const fetchLoanSummaryRequest = () => {
  return {
    type: FETCH_LOAN_SUMMARY_REQUEST
  }
}

export const fetchLoanSummarySuccess = (loanSummary) => {
  return {
    type: FETCH_LOAN_SUMMARY_SUCCESS,
    loanSummary,
  }
}

export const fetchLoanSummaryError = () => {
  return {
    type: FETCH_LOAN_SUMMARY_FAILURE
  }
}