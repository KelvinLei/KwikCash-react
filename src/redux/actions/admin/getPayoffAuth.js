import { getPayoffAuthorization } from '../../../api/adminApiClient'
import downloadjs from 'downloadjs'
export const GET_PAYOFF_FORM_REQUEST = 'GET_PAYOFF_FORM_REQUEST'
export const GET_PAYOFF_FORM_SUCCESS = 'GET_PAYOFF_FORM_SUCCESS'
export const GET_PAYOFF_FORM_FAILURE = 'GET_PAYOFF_FORM_FAILURE'

export const getPayoffFormAction = (loanId) => {
  return (dispatch) => {
    dispatch(getPayoffFormRequest())

    getPayoffAuthorization(loanId)
      .then(response => {
        dispatch(getPayoffFormSuccess())
        downloadjs(response, `payoff_form_${loanId}.docx`, "application/vnd.ms-word'")
      })
      .catch(() => {
        console.log("getPayoffFormAction")
        dispatch(getPayoffFormError())
      })
  }
}

export const getPayoffFormRequest = () => {
  return {
    type: GET_PAYOFF_FORM_REQUEST
  }
}

export const getPayoffFormSuccess = () => {
  return {
    type: GET_PAYOFF_FORM_SUCCESS,
  }
}

export const getPayoffFormError = () => {
  return {
    type: GET_PAYOFF_FORM_FAILURE
  }
}