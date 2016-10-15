import {
  SELECT_PAYMENT_STATUS, SELECT_REFINANCE_VALUE, ENTER_REFINANCE_VALUE, SELECT_USER_REFINANCE_VALUE, SELECT_PAYMENTS_YEAR
} from '../../actions/member/memberAction'
import {
  FETCH_LOAN_LIST_REQUEST, FETCH_LOAN_LIST_SUCCESS, FETCH_LOAN_LIST_ERROR
} from '../../actions/member/fetchLoanList'
import {
  FETCH_PAYMENTS_ERROR, FETCH_PAYMENTS_REQUEST, FETCH_PAYMENTS_SUCCESS
} from '../../actions/member/fetchPayments'
import {
  FETCH_GET_USER_DATA_REQUEST, FETCH_GET_USER_DATA_SUCCESS, FETCH_GET_USER_DATA_FAILURE
} from '../../actions/member/fetchUserData'
import {
  CHANGE_PASSWORD_REQUEST, CHANGE_PASSWORD_SUCCESS, CHANGE_PASSWORD_FAILURE, CHANGE_PASSWORD_RESET,
  INCORRECT_CURRENT_PASSWORD
} from "../../actions/member/changePassword";

var Immutable = require('immutable');

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

const generateUniquePaymentDueYear = (payments) => {
  const paymentYearsListValueWithDup = payments.map ( (payment) => {
    return new Date(payment.paymentDate).toISOString().slice(0, 4)
  })

  const storedPaymentYearSet = new Set(paymentYearsListValueWithDup)
  return Array.from(storedPaymentYearSet)
}

const createPaymentData = (paymentsList, paymentSchedule, interestRate) => {
  // create a list of unique payment due years
  const paymentYearsList = generateUniquePaymentDueYear(paymentsList)
  const selectedPaymentYear = paymentYearsList.length > 0 ? paymentYearsList[0] : 'All'

  return {
    paymentList: paymentsList,
    paymentYearsList: paymentYearsList,
    selectedPaymentYear: selectedPaymentYear,
    paymentSchedule: paymentSchedule,
    interestRate: interestRate, // two decimals for APR,
  }
}

const paymentState = (state = {
  isFetching: false,
  fetchPaymentsFailed: false,
  paymentsDataMap: Immutable.Map(),
  selectedPaymentStatus: 'All'
}, action) => {

  switch (action.type) {
    case FETCH_PAYMENTS_REQUEST:
      return {
        ...state,
        isFetching: true,
        fetchPaymentsFailed: false
      }
    case FETCH_PAYMENTS_SUCCESS:
      // create the paymentData object
      const paymentData = createPaymentData(action.payments, action.paymentSchedule, action.interestRate)

      // create a new paymentsDataMap with the new paymentData added
      const newPaymentsMap = state.paymentsDataMap.set(action.loanId, paymentData)

      return {
        ...state,
        isFetching: false,
        fetchPaymentsFailed: false,
        paymentsDataMap: newPaymentsMap
      }
    case FETCH_PAYMENTS_ERROR:
      return {
        ...state,
        isFetching: false,
        fetchPaymentsFailed: true
      }
    case SELECT_PAYMENT_STATUS:
      return {
        ...state,
        selectedPaymentStatus: action.selectedStatus
      }
    case SELECT_PAYMENTS_YEAR:
      const selectedLoanPaymentData = state.paymentsDataMap.get(action.loanId)
      const newPaymentData = {
        ...selectedLoanPaymentData,
        selectedPaymentYear: action.selectedPaymentYear
      }
      const newPaymentsDataMap = state.paymentsDataMap.set(action.loanId, newPaymentData)

      return {
        ...state,
        paymentsDataMap: newPaymentsDataMap
      }

    default:
      return state
  }
}

const userDataState = (state = {
  isFetching: false,
  isFailed: false,
  userData: {}
}, action) => {

  switch (action.type) {
    case FETCH_GET_USER_DATA_REQUEST:
      return {
        ...state,
        isFetching: true,
        isFailed: false,
      }
    case FETCH_GET_USER_DATA_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isFailed: false,
        userData: action.userData
      }
    case FETCH_GET_USER_DATA_FAILURE:
      return {
        ...state,
        isFetching: false,
        isFailed: true,
      }
    default:
      return state
  }
}

const changePasswordState = (state = {
  isFetching: false,
  isFailed: false,
  incorrectCurrPassword: false,
  success: false,
}, action) => {
  switch (action.type) {
    case CHANGE_PASSWORD_REQUEST:
      return {
        ...state,
        isFetching: true,
        isFailed: false,
        success: false,
        incorrectCurrPassword: false,
      }
    case CHANGE_PASSWORD_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isFailed: false,
        success: true,
        incorrectCurrPassword: false,
      }
    case INCORRECT_CURRENT_PASSWORD:
      return {
        ...state,
        isFetching: false,
        isFailed: false,
        success: false,
        incorrectCurrPassword: true,
      }
    case CHANGE_PASSWORD_RESET:
      return {
        ...state,
        isFetching: false,
        isFailed: false,
        success: false,
        incorrectCurrPassword: false,
      }
    case CHANGE_PASSWORD_FAILURE:
      return {
        ...state,
        isFetching: false,
        isFailed: true,
        success: false,
        incorrectCurrPassword: false,
      }

    default:
      return state
  }
}

export default {
  refinanceState,
  loanList,
  paymentState,
  userDataState,
  changePasswordState,
}
