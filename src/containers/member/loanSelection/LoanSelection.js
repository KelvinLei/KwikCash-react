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

    return (
      <div>
        <LoanSelectionContent isFetching={isFetching} fetchLoansFailed={fetchLoansFailed} loanList={loans}/>
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
