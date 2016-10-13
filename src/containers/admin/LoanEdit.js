import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import LoanEditContent from '../../components/admin/loanEdit/LoanEditContent'
import {fetchLoanSummaryAction} from "../../redux/actions/admin/fetchLoanSummary"
import { LoadingSpinner } from '../../components/shared/LoadingSpinner'
import { FailureWidget } from '../../components/shared/FailureWidget'
import {editLoanAction, resetEditLoanAlertAction} from "../../redux/actions/admin/editLoan";

class LoanEdit extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { fetchLoanSummary, resetEditLoanAlert } = this.props
    const { loanId } = this.props.params
    fetchLoanSummary(loanId)
    resetEditLoanAlert()
  }

  render() {
    const { loanSummaryState, editLoanActionState, editLoanOnclick } = this.props
    const { isFetching, isFetchFailed, loanSummary} = loanSummaryState

    let displayContent
    if (isFetching) {
      displayContent = <LoadingSpinner/>
    }
    else if (isFetchFailed) {
      displayContent = <FailureWidget/>
    }
    else {
      displayContent = <LoanEditContent loanLevelData={loanSummary.loanLevelData}
                                        editLoanActionState={editLoanActionState}
                                        editLoanOnclick={editLoanOnclick}

                      />
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
    editLoanOnclick: (editLoanContext) => dispatch(editLoanAction(editLoanContext)),
    resetEditLoanAlert: () => dispatch(resetEditLoanAlertAction()),
  }
}

function mapStateToProps(state) {
  const { loanSummaryState, editLoanActionState } = state

  return {
    loanSummaryState,
    editLoanActionState,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoanEdit)
