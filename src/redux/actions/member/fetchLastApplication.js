import { getLastApplication } from '../../../api/memberApiClient'

export const FETCH_LAST_APP_REQUEST = 'FETCH_LAST_APP_REQUEST'
export const FETCH_LAST_APP_SUCCESS = 'FETCH_LAST_APP_SUCCESS'
export const FETCH_LAST_APP_FAILURE = 'FETCH_LAST_APP_FAILURE'

export const fetchLastAppAction = () => {
  return (dispatch) => {
    dispatch(fetchLastAppRequest())

    getLastApplication()
      .then(response => {
        dispatch(fetchLastAppSuccess(response.lastApplication))
      })
      .catch(() => {
        console.log("fetch loan list failed")
        dispatch(fetchLastAppError())
      })
  }
}

export const fetchLastAppRequest = () => {
  return {
    type: FETCH_LAST_APP_REQUEST
  }
}

export const fetchLastAppSuccess = (lastApplication) => {
  return {
    type: FETCH_LAST_APP_SUCCESS,
    lastApplication: lastApplication
  }
}

export const fetchLastAppError = () => {
  return {
    type: FETCH_LAST_APP_FAILURE
  }
}