import { getLoanList } from '../../../api/memberApiClient'

export const FETCH_LOAN_LIST_REQUEST = 'FETCH_LOAN_LIST_REQUEST'
export const FETCH_LOAN_LIST_SUCCESS = 'FETCH_LOAN_LIST_SUCCESS'
export const FETCH_LOAN_LIST_ERROR = 'FETCH_LOAN_LIST_ERROR'

/*
 Fetch loan list data if no data has been cached
 */
export const fetchLoanListAction = () => {
  return (dispatch, getState) => {
    const state = getState()

    dispatch(fetchLoanListRequest())

    getLoanList()
      .then(response => {
        dispatch(fetchLoanListSuccess(response.loans))
      })
      .catch(() => {
        console.log("fetch loan list failed")
        dispatch(fetchLoanListError())
      })
  }
}

export const fetchLoanListRequest = () => {
  return {
    type: FETCH_LOAN_LIST_REQUEST
  }
}

export const fetchLoanListSuccess = (loanList) => {
  return {
    type: FETCH_LOAN_LIST_SUCCESS,
    loans: loanList
  }
}

export const fetchLoanListError = () => {
  return {
    type: FETCH_LOAN_LIST_ERROR
  }
}