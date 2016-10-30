import { submitReapply } from '../../../api/memberApiClient'
import { browserHistory } from 'react-router'

export const SUBMIT_REAPPLY_REQUEST = 'SUBMIT_REAPPLY_REQUEST'
export const SUBMIT_REAPPLY_SUCCESS = 'SUBMIT_REAPPLY_SUCCESS'
export const SUBMIT_REAPPLY_FAILURE = 'SUBMIT_REAPPLY_FAILURE'
export const SUBMIT_REAPPLY_RESET = 'SUBMIT_REAPPLY_RESET'

export const submitReapplyAction = (reapplyInput) => {
  return (dispatch) => {
    dispatch(submitReapplyRequest())

    submitReapply(reapplyInput)
      .then(response => {
        browserHistory.push(`/myLoans/reapply/results/1`)
      })
      .catch(() => {
        console.log("submitReapplyAction failed")
        browserHistory.push(`/myLoans/reapply/results/0`)
      })
  }
}

export const submitReapplyRequest = () => {
  return {
    type: SUBMIT_REAPPLY_REQUEST
  }
}

export const submitReapplyReset = () => {
  return {
    type: SUBMIT_REAPPLY_RESET
  }
}

export const submitReapplySuccess = (userData) => {
  return {
    type: SUBMIT_REAPPLY_SUCCESS,
    userData
  }
}

export const submitReapplyFailure = () => {
  return {
    type: SUBMIT_REAPPLY_FAILURE
  }
}
