import { getUserData } from '../../../api'

export const FETCH_GET_USER_DATA_REQUEST = 'FETCH_GET_USER_DATA_REQUEST'
export const FETCH_GET_USER_DATA_SUCCESS = 'FETCH_GET_USER_DATA_SUCCESS'
export const FETCH_GET_USER_DATA_FAILURE = 'FETCH_GET_USER_DATA_FAILURE'

/*
 Fetch loan list data if no data has been cached
 */
export const fetchGetUserDataAction = () => {
  return (dispatch, getState) => {
    dispatch(fetchGetUserDataRequest())

    getUserData()
      .then(response => dispatch(fetchGetUserDataSuccess(response.userData)))
      .catch(() => {
        console.log("fetch user data failed")
        dispatch(fetchGetUserDataError())
      })
  }
}

export const fetchGetUserDataRequest = () => {
  return {
    type: FETCH_GET_USER_DATA_REQUEST
  }
}

export const fetchGetUserDataSuccess = (userData) => {
  return {
    type: FETCH_GET_USER_DATA_SUCCESS,
    userData
  }
}

export const fetchGetUserDataError = () => {
  return {
    type: FETCH_GET_USER_DATA_ERROR
  }
}
