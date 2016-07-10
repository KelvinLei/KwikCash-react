import {
  SELECT_MEMBER_PAGE, SELECT_PAYMENT_STATUS, SELECT_REFINANCE_VALUE, ENTER_REFINANCE_VALUE, SELECT_USER_REFINANCE_VALUE
} from '../../actions/member/memberAction'
import {
  FETCH_LOAN_LIST_REQUEST, FETCH_LOAN_LIST_SUCCESS, FETCH_LOAN_LIST_ERROR
} from '../../actions/member/fetchLoanList'

function selectedPaymentStatus(state = "all", action) {
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

const refinanceState = (state = {
  refinanceValue: 5000,
  userInputRefinanceValue: {
    selected: false,
    value: ""
  }
}, action) => {
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

const loanList = (state = {
  isFetching: false,
  fetchLoansFailed: false,
  loans: []
}, action) => {
  switch (action.type) {
    case FETCH_LOAN_LIST_REQUEST:
      return {
        ...state,
        isFetching: true,
        fetchLoansFailed: false,
        loans: []
      }
    case FETCH_LOAN_LIST_SUCCESS:
      // mocking a complete loan for testing purpose
      const completeLoan = {
        balance: 0,
        loanFundAmount: 10000,
        loanFundDate: "2016-06-01T07:00:00.000Z",
        loanId: 6123,
        loanRate: 75.5123,
        loanStatus: "COMPLETE",
        loanTerm: 24,
        nextPaymentDate: "2016-06-01T07:00:00.000Z"
      }
      action.loans.push(completeLoan)
      
      return {
        ...state,
        isFetching: false,
        fetchLoansFailed: false,
        loans: action.loans
      }
    case FETCH_LOAN_LIST_ERROR:
      return {
        ...state,
        isFetching: false,
        fetchLoansFailed: true,
        loans: []
      }

    default:
      return state
  }
}

export default {
  selectedPage,
  selectedPaymentStatus,
  refinanceState,
  loanList
}
