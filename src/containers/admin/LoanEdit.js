import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import LoanEditContent from '../../components/admin/loanEdit/LoanEditContent'
import {fetchLoanSummaryAction} from "../../redux/actions/admin/fetchLoanSummary"
import { LoadingSpinner } from '../../components/shared/LoadingSpinner'
import { FailureWidget } from '../../components/shared/FailureWidget'

class LoanEdit extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { fetchLoanSummary } = this.props
    const { loanId } = this.props.params
    fetchLoanSummary(loanId)
  }

  render() {
    const { loanSummaryState } = this.props
    const { isFetching, isFetchFailed, loanSummary} = loanSummaryState

    let displayContent
    if (isFetching) {
      displayContent = <LoadingSpinner/>
    }
    else if (isFetchFailed) {
      displayContent = <FailureWidget/>
    }
    else {
      displayContent = <LoanEditContent loanLevelData={loanSummary.loanLevelData}/>
    }

    return (
      <div>
        { displayContent }
      </div>
    )
  }
}

LoanEdit.propTypes = {
  loanSummaryState: PropTypes.object.isRequired
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchLoanSummary: (loanId) => dispatch(fetchLoanSummaryAction(loanId)),
  }
}

function mapStateToProps(state) {
  const { loanSummaryState } = state

  return {
    loanSummaryState,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoanEdit)
