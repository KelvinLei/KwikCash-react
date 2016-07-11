import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { LoanSelectionContent } from '../../../components/member/loanSelection/LoanSelectionContent'
import { fetchLoanListAction } from '../../../redux/actions/member/fetchLoanList'

export default class LoanSelection extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { fetchLoanList } = this.props
    fetchLoanList()
  }

  render() {
    const { isFetching, fetchLoansFailed, loans } = this.props;

    // convert data model from database to application data model
    const loanList = !isFetching && !fetchLoansFailed && loans.map( (loan) => {
      // date format should be YYYY-MM-DD
      const nextPayDate = new Date(loan.nextPaymentDate).toISOString().slice(0, 10)
      const fundDate = new Date(loan.loanFundDate).toISOString().slice(0, 10)

      return {
        id: loan.loanId,
        status: loan.loanStatus,
        balance: loan.balance,
        APR: loan.loanRate.toFixed(2), // two decimals for APR
        nextPaymentDate: nextPayDate,
        term: loan.loanTerm,
        fundDate: fundDate
      }
    })

    return (
      <div>
        <LoanSelectionContent isFetching={isFetching} fetchLoansFailed={fetchLoansFailed} loanList={loanList}/>
      </div>
    )
  }
}

LoanSelection.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  fetchLoansFailed: PropTypes.bool.isRequired,
  loans: PropTypes.array.isRequired,
  fetchLoanList: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => {
  return {
    fetchLoanList: () => dispatch(fetchLoanListAction())
  }
}

function mapStateToProps(state) {
  const { loanList } = state

  return {
    isFetching: loanList.isFetching,
    fetchLoansFailed: loanList.fetchLoansFailed,
    loans: loanList.loans
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoanSelection)
