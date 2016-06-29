import {
  SELECT_MEMBER_PAGE, SELECT_PAYMENT_STATUS, SELECT_REFINANCE_VALUE, ENTER_REFINANCE_VALUE, SELECT_USER_REFINANCE_VALUE
} from '../../actions/member/memberAction'

function selectPaymentStatus(state = "all", action) {
  switch (action.type) {
    case SELECT_PAYMENT_STATUS:
      return action.selectedStatus

    default:
      return state
  }
}

function selectedPage(state = "myLoans", action) {
  switch (action.type) {
    case SELECT_MEMBER_PAGE:
      return action.selectedNavTab

    default:
      return state
  }
}

function loanList(state = [], action) {
  switch (action.type) {
    case SELECT_MEMBER_PAGE:
      return action.selectedNavTab

    default:
      return state
  }
}


function refinanceState(
  state = {
    refinanceValue: 5000,
    userInputRefinanceValue: {
      selected: false,
      value: ""
    }
  },
  action
) {
  switch (action.type) {
    case SELECT_REFINANCE_VALUE:
      const userValueState = {
        ...state.userInputRefinanceValue,
        selected: false
      }
      return {
        refinanceValue: action.selectedRefinanceValue,
        userInputRefinanceValue: userValueState
      }

    case ENTER_REFINANCE_VALUE:
      const userValueStateForEnter = {
        ...state.userInputRefinanceValue,
        value: action.userInputRefinanceValue
      }
      return {
        ...state,
        userInputRefinanceValue: userValueStateForEnter
      }

    case SELECT_USER_REFINANCE_VALUE:
      const userValueStateForSelect = {
        ...state.userInputRefinanceValue,
        selected: true
      }
      return {
        ...state,
        userInputRefinanceValue: userValueStateForSelect
      }

    default:
      return state
  }
}

export default {
  selectedPage,
  selectPaymentStatus,
  refinanceState
}
