import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { LoanSummaryContent } from '../../components/admin/loanSummary/LoanSummaryContent'
import {fetchLoanSummaryAction} from "../../redux/actions/admin/fetchLoanSummary";

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

    return (
      <div>
        <LoanSummaryContent isFetching={loanSummaryState.isFetching}
                            isFetchFailed={loanSummaryState.isFetchFailed}
                            loanSummary={loanSummaryState.loanSummary}
        />
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
