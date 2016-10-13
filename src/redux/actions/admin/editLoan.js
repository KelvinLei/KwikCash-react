import { editLoan } from '../../../api/adminApiClient'

export const EDIT_LOAN_REQUEST = 'EDIT_LOAN_REQUEST'
export const EDIT_LOAN_SUCCESS = 'EDIT_LOAN_SUCCESS'
export const EDIT_LOAN_FAILURE = 'EDIT_LOAN_FAILURE'
export const RESET_EDIT_LOAN_ALERT = 'RESET_EDIT_LOAN_ALERT'

export const editLoanAction = (editLoanContext) => {
  return (dispatch) => {
    dispatch(editLoanRequest())

    editLoan(editLoanContext)
      .then(response => {
        dispatch(editLoanSuccess())
      })
      .catch(() => {
        console.log("editLoanAction failed " + JSON.stringify(editLoanContext))
        dispatch(editLoanError())
      })
  }
}

export const editLoanRequest = () => {
  return {
    type: EDIT_LOAN_REQUEST
  }
}

export const editLoanSuccess = () => {
  return {
    type: EDIT_LOAN_SUCCESS,
  }
}

export const editLoanError = () => {
  return {
    type: EDIT_LOAN_FAILURE
  }
}

export const resetEditLoanAlertAction = () => {
  return {
    type: RESET_EDIT_LOAN_ALERT
  }
}