import { fetchLoanStats } from '../../../api/adminApiClient'

export const FETCH_LOAN_STATS_REQUEST = 'FETCH_LOAN_STATS_REQUEST'
export const FETCH_LOAN_STATS_SUCCESS = 'FETCH_LOAN_STATS_SUCCESS'
export const FETCH_LOAN_STATS_FAILURE = 'FETCH_LOAN_STATS_FAILURE'

export const fetchLoanStatsAction = (dateRange) => {
  return (dispatch) => {
    dispatch(fetchLoanStatsRequest())

    fetchLoanStats(dateRange)
      .then(response => {
        dispatch(fetchLoanStatsSuccess(response.loanStats))
      })
      .catch(() => {
        console.log("failed to fetchLoanStatsAction, date range " + dateRange)
        dispatch(fetchLoanStatsError())
      })
  }
}

export const fetchLoanStatsRequest = () => {
  return {
    type: FETCH_LOAN_STATS_REQUEST
  }
}

export const fetchLoanStatsSuccess = (loanStats) => {
  return {
    type: FETCH_LOAN_STATS_SUCCESS,
    loanStats,
  }
}

export const fetchLoanStatsError = () => {
  return {
    type: FETCH_LOAN_STATS_FAILURE
  }
}