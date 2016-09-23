import {
  FILTER_LOANS_ERROR, FILTER_LOANS_REQUEST, FILTER_LOANS_SUCCESS
} from '../../actions/admin/filterLoans'

import {
  EXPORT_LOANS_ERROR, EXPORT_LOANS_REQUEST
} from '../../actions/admin/exportLoans'


const loanList = (state = {
  isFetching: false,
  fetchLoansFailed: false,
  loans: [],
  filterContext: {},
}, action) => {
  switch (action.type) {
    case FILTER_LOANS_REQUEST:
      return {
        ...state,
        isFetching: true,
        fetchLoansFailed: false,
        loans: [],
        filterContext: {}
      }
    case FILTER_LOANS_SUCCESS:
      // convert raw data from database to application data format
      const loanList = action.loans.map( (loan) => {
        // date format should be YYYY-MM-DD
        const fundDate = loan.loanFundDate && new Date(loan.loanFundDate).toISOString().slice(0, 10)
        const noteDate = loan.loanNoteDate && new Date(loan.loanNoteDate).toISOString().slice(0, 10)
        const defaultDate = loan.defaultDate && new Date(loan.defaultDate).toISOString().slice(0, 10)

        return {
          ...loan,
          loanRate: loan.loanRate.toFixed(2), // two decimals for APR
          loanFundDate: fundDate,
          loanNoteDate: noteDate,
          defaultDate: defaultDate,
        }
      })

      return {
        ...state,
        isFetching: false,
        fetchLoansFailed: false,
        loans: loanList,
        filterContext: action.filterContext
      }
    case FILTER_LOANS_ERROR:
      return {
        ...state,
        isFetching: false,
        fetchLoansFailed: true,
        loans: [],
        filterContext: {}
      }

    default:
      return state
  }
}

const exportLoans = (state = {
  isFetching: false,
  fetchLoansFailed: false,
}, action) => {
  switch (action.type) {
    case EXPORT_LOANS_REQUEST:
      return {
        ...state,
        isFetching: true,
        fetchLoansFailed: false,
      }
    case EXPORT_LOANS_ERROR:
      return {
        ...state,
        isFetching: false,
        fetchLoansFailed: true,
      }

    default:
      return state
  }
}

export default {
  loanList,
  exportLoans
}
