import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { LoanSummaryContent } from '../../components/admin/loanSummary/LoanSummaryContent'
import {fetchLoanSummaryAction} from "../../redux/actions/admin/fetchLoanSummary";
import { LoadingSpinner } from '../../components/shared/LoadingSpinner'
import { FailureWidget } from '../../components/shared/FailureWidget'

class LoanSummaryAdmin extends Component {

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

    let displayContent
    if (loanSummaryState.isFetching) {
      displayContent = <LoadingSpinner/>
    }
    else if (loanSummaryState.isFetchFailed) {
      displayContent = <FailureWidget/>
    }
    else {
      displayContent = <LoanSummaryContent loanSummary={loanSummaryState.loanSummary}/>
    }

    return (
      <div>
        { displayContent }
      </div>
    )
  }
}

LoanSummaryAdmin.propTypes = {
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
)(LoanSummaryAdmin)
