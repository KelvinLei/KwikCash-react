import { fetchARReport } from '../../../api/adminApiClient'

export const FETCH_AR_REPORT_REQUEST = 'FETCH_AR_REPORT_REQUEST'
export const FETCH_AR_REPORT_SUCCESS = 'FETCH_AR_REPORT_SUCCESS'
export const FETCH_AR_REPORT_FAILURE = 'FETCH_AR_REPORT_FAILURE'

export const fetchARReportAction = () => {
  return (dispatch, getState) => {
    const state = getState()

    dispatch(fetchARReportRequest())

    fetchARReport()
      .then(response => {
        dispatch(fetchARReportSuccess(response.arReport))
      })
      .catch(() => {
        console.log("failed to fetchARReportAction")
        dispatch(fetchARReportError())
      })
  }
}

export const fetchARReportRequest = () => {
  return {
    type: FETCH_AR_REPORT_REQUEST
  }
}

export const fetchARReportSuccess = (arReport) => {
  return {
    type: FETCH_AR_REPORT_SUCCESS,
    arReport,
  }
}

export const fetchARReportError = () => {
  return {
    type: FETCH_AR_REPORT_FAILURE
  }
}