import {
  SELECT_PAYMENT_STATUS, SELECT_REFINANCE_VALUE, ENTER_REFINANCE_VALUE, SELECT_USER_REFINANCE_VALUE
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
      // mocking a complete loan and a late loan for testing purpose
      const completeLoan = {
        balance: 0,
        loanFundAmount: 10000,
        loanFundDate: "2016-06-01T07:00:00.000Z",
        loanId: 6123,
        loanRate: 75.5123,
        loanStatus: "P",
        loanTerm: 24,
        nextPaymentDate: "2016-06-01T07:00:00.000Z"
      }
      const lateLoan = {
        balance: 3000,
        loanFundAmount: 10000,
        loanFundDate: "2016-06-01T07:00:00.000Z",
        loanId: 6055,
        loanRate: 75.5123,
        loanStatus: "L",
        loanTerm: 24,
        nextPaymentDate: "2016-06-01T07:00:00.000Z"
      }
      const manualLoan = {
        balance: 3000,
        loanFundAmount: 10000,
        loanFundDate: "2016-06-01T07:00:00.000Z",
        loanId: 5123,
        loanRate: 75.5123,
        loanStatus: "M",
        loanTerm: 24,
        nextPaymentDate: "2016-06-01T07:00:00.000Z"
      }
      const chargedOffLoan = {
        balance: 3000,
        loanFundAmount: 10000,
        loanFundDate: "2016-06-01T07:00:00.000Z",
        loanId: 1231,
        loanRate: 75.5123,
        loanStatus: "D",
        loanTerm: 24,
        nextPaymentDate: "2016-06-01T07:00:00.000Z"
      }
      const planLoan = {
        balance: 3000,
        loanFundAmount: 10000,
        loanFundDate: "2016-06-01T07:00:00.000Z",
        loanId: 5635,
        loanRate: 75.5123,
        loanStatus: "F",
        loanTerm: 24,
        nextPaymentDate: "2016-06-01T07:00:00.000Z"
      }

      action.loans.push(completeLoan)
      action.loans.push(lateLoan)
      action.loans.push(manualLoan)
      action.loans.push(chargedOffLoan)
      action.loans.push(planLoan)

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
  selectedPaymentStatus,
  refinanceState,
  loanList
}
