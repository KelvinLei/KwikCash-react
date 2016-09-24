import { filterLoans } from '../../../api/adminApiClient'

export const FILTER_LOANS_REQUEST = 'FILTER_LOANS_REQUEST'
export const FILTER_LOANS_SUCCESS = 'FILTER_LOANS_SUCCESS'
export const FILTER_LOANS_ERROR = 'FILTER_LOANS_ERROR'

/*
 Fetch loan list data if no data has been cached
 */
export const filterLoansAction = (filterContext) => {
  return (dispatch, getState) => {
    const state = getState()

    dispatch(filterLoansRequest())

    filterLoans(filterContext)
      .then(response => {
        dispatch(filterLoansSuccess(response.loans, filterContext))
      })
      .catch(() => {
        console.log("fetch loan list failed")
        dispatch(filterLoansError())
      })
  }
}

export const filterLoansRequest = () => {
  return {
    type: FILTER_LOANS_REQUEST
  }
}

export const filterLoansSuccess = (loanList, filterContext) => {
  return {
    type: FILTER_LOANS_SUCCESS,
    loans: loanList,
    filterContext
  }
}

export const filterLoansError = () => {
  return {
    type: FILTER_LOANS_ERROR
  }
}