import {
  SELECT_PAYMENT_STATUS, SELECT_REFINANCE_VALUE, ENTER_REFINANCE_VALUE, SELECT_USER_REFINANCE_VALUE
} from '../../actions/member/memberAction'
import {
  FETCH_LOAN_LIST_REQUEST, FETCH_LOAN_LIST_SUCCESS, FETCH_LOAN_LIST_ERROR
} from '../../actions/member/fetchLoanList'
import {
  FETCH_PAYMENTS_ERROR, FETCH_PAYMENTS_REQUEST, FETCH_PAYMENTS_SUCCESS
} from '../../actions/member/fetchPayments'

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
        loanStatus: "PAID",
        loanCode: "P",
        loanTerm: 24,
        nextPaymentDate: "2016-06-01T07:00:00.000Z"
      }
      const lateLoan = {
        balance: 3000,
        loanFundAmount: 10000,
        loanFundDate: "2016-06-01T07:00:00.000Z",
        loanId: 6055,
        loanRate: 75.5123,
        loanStatus: "LATE",
        loanCode: "L",
        loanTerm: 24,
        nextPaymentDate: "2016-06-01T07:00:00.000Z"
      }
      const manualLoan = {
        balance: 3000,
        loanFundAmount: 10000,
        loanFundDate: "2016-06-01T07:00:00.000Z",
        loanId: 5123,
        loanRate: 75.5123,
        loanStatus: "MANUAL",
        loanCode: "M",
        loanTerm: 24,
        nextPaymentDate: "2016-06-01T07:00:00.000Z"
      }
      const chargedOffLoan = {
        balance: 3000,
        loanFundAmount: 10000,
        loanFundDate: "2016-06-01T07:00:00.000Z",
        loanId: 1231,
        loanRate: 75.5123,
        loanStatus: "Charged off",
        loanCode: "D",
        loanTerm: 24,
        nextPaymentDate: "2016-06-01T07:00:00.000Z"
      }
      const planLoan = {
        balance: 3000,
        loanFundAmount: 10000,
        loanFundDate: "2016-06-01T07:00:00.000Z",
        loanId: 5635,
        loanRate: 75.5123,
        loanStatus: "PLAN",
        loanCode: "F",
        loanTerm: 24,
        nextPaymentDate: "2016-06-01T07:00:00.000Z"
      }

      action.loans.push(completeLoan)
      action.loans.push(lateLoan)
      action.loans.push(manualLoan)
      action.loans.push(chargedOffLoan)
      action.loans.push(planLoan)

      // convert raw data from database to application data format
      const loanList = action.loans.map( (loan) => {
          // date format should be YYYY-MM-DD
          const nextPayDate = new Date(loan.nextPaymentDate).toISOString().slice(0, 10)
          const fundDate = new Date(loan.loanFundDate).toISOString().slice(0, 10)

          return {
            ...loan,
            loanRate: loan.loanRate.toFixed(2), // two decimals for APR
            nextPaymentDate: nextPayDate,
            loanFundDate: fundDate
          }
        })

      return {
        ...state,
        isFetching: false,
        fetchLoansFailed: false,
        loans: loanList
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

const paymentState = (state = {
  isFetching: false,
  fetchPaymentsFailed: false,
  payments: []
}, action) => {
  switch (action.type) {
    case FETCH_PAYMENTS_REQUEST:
      return {
        ...state,
        isFetching: true,
        fetchPaymentsFailed: false,
        payments: []
      }
    case FETCH_PAYMENTS_SUCCESS:
      // convert raw data from database to application data format
      const newPaymentList = action.payments.map( (payment) => {
        // date format should be YYYY-MM-DD
        const paymentDueDate = new Date(payment.loanpayment_date).toISOString().slice(0, 10)

        return {
          ...payment,
          loanpayment_rate: payment.loanpayment_rate.toFixed(2), // two decimals for APR,
          loanpayment_date: paymentDueDate
        }
      })
      
      const newPaymentsMap = state.payments.slice()
      newPaymentsMap[action.loanId] = newPaymentList

      return {
        ...state,
        isFetching: false,
        fetchPaymentsFailed: false,
        payments: newPaymentsMap
      }
    case FETCH_PAYMENTS_ERROR:
      return {
        ...state,
        isFetching: false,
        fetchPaymentsFailed: true,
        payments: []
      }

    default:
      return state
  }
}

export default {
  selectedPaymentStatus,
  refinanceState,
  loanList,
  paymentState
}
