export const SELECT_PAYMENT_STATUS = 'SELECT_PAYMENT_STATUS'
export const SELECT_REFINANCE_VALUE = 'SELECT_REFINANCE_VALUE'
export const ENTER_REFINANCE_VALUE = 'ENTER_REFINANCE_VALUE'
export const SELECT_USER_REFINANCE_VALUE = 'SELECT_USER_REFINANCE_VALUE'

export const selectPaymentStatus = (status) => {
  return {
    type: SELECT_PAYMENT_STATUS,
    selectedStatus: status
  }
}

export const selectRefinanceValue = (value) => {
  return {
    type: SELECT_REFINANCE_VALUE,
    selectedRefinanceValue: value
  }
}

export const enterRefinanceValue = (value) => {
  return {
    type: ENTER_REFINANCE_VALUE,
    userInputRefinanceValue: value
  }
}

export const selectUserRefinanceValue = () => {
  return {
    type: SELECT_USER_REFINANCE_VALUE
  }
}