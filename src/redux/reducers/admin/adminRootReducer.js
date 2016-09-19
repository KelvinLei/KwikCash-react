import {
  FILTER_LOANS_ERROR, FILTER_LOANS_REQUEST, FILTER_LOANS_SUCCESS
} from '../../actions/admin/filterLoans'


const loanList = (state = {
  isFetching: false,
  fetchLoansFailed: false,
  loans: []
}, action) => {
  switch (action.type) {
    case FILTER_LOANS_REQUEST:
      return {
        ...state,
        isFetching: true,
        fetchLoansFailed: false,
        loans: []
      }
    case FILTER_LOANS_SUCCESS:
      // convert raw data from database to application data format
      const loanList = action.loans.map( (loan) => {
        // date format should be YYYY-MM-DD
        const fundDate = loan.loanFundDate && new Date(loan.loanFundDate).toISOString().slice(0, 10)
        const noteDate = loan.loanNoteDate && new Date(loan.loanNoteDate).toISOString().slice(0, 10)

        return {
          ...loan,
          loanRate: loan.loanRate.toFixed(2), // two decimals for APR
          loanFundDate: fundDate,
          loanNoteDate: noteDate
        }
      })

      return {
        ...state,
        isFetching: false,
        fetchLoansFailed: false,
        loans: loanList
      }
    case FILTER_LOANS_ERROR:
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
  loanList,
}
