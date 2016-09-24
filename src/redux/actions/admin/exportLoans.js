import { exportLoans } from '../../../api/adminApiClient'
import downloadjs from 'downloadjs'

export const EXPORT_LOANS_REQUEST = 'EXPORT_LOANS_REQUEST'
export const EXPORT_LOANS_SUCCESS = 'EXPORT_LOANS_SUCCESS'
export const EXPORT_LOANS_ERROR = 'EXPORT_LOANS_ERROR'

/*
 Fetch loan list data if no data has been cached
 */
export const exportLoansAction = (filterContext) => {
  return (dispatch, getState) => {
    const state = getState()

    dispatch(exportLoansRequest())

    exportLoans(filterContext)
      .then(response => {
        dispatch(exportLoansSuccess())
        downloadjs(response, "exportedLoan.xlsx", "application/vnd.ms-excel")
      })
      .catch(() => {
        console.log("fetch loan list failed")
        dispatch(exportLoansError())
      })
  }
}

export const exportLoansRequest = () => {
  return {
    type: EXPORT_LOANS_REQUEST
  }
}

export const exportLoansSuccess = () => {
  return {
    type: EXPORT_LOANS_SUCCESS
  }
}

export const exportLoansError = () => {
  return {
    type: EXPORT_LOANS_ERROR
  }
}
