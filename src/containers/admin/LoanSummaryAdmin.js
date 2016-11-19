import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { LoanSummaryContent } from '../../components/admin/loanSummary/LoanSummaryContent'
import {fetchLoanSummaryAction} from "../../redux/actions/admin/fetchLoanSummary";
import { LoadingSpinner } from '../../components/shared/LoadingSpinner'
import { FailureWidget } from '../../components/shared/FailureWidget'
import {deletePaymentAction, resetDeletePaymentState} from "../../redux/actions/admin/deletePayment";
import {waivePaymentAction, resetWaivePaymentState} from "../../redux/actions/admin/waivePayment";

class LoanSummaryAdmin extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { fetchLoanSummary, resetDeletePaymentState, resetWaivePaymentState } = this.props
    const { loanId } = this.props.params
    fetchLoanSummary(loanId)
    resetDeletePaymentState()
    resetWaivePaymentState()
  }

  render() {
    const { loanSummaryState, deletePaymentState, waivePaymentState, deletePayment, waivePayment } = this.props

    let displayContent
    if (loanSummaryState.isFetching) {
      displayContent = <LoadingSpinner/>
    }
    else if (loanSummaryState.isFetchFailed) {
      displayContent = <FailureWidget/>
    }
    else {
      displayContent = <LoanSummaryContent loanSummary={loanSummaryState.loanSummary}
                                           deletePaymentState={deletePaymentState}
                                           waivePaymentState={waivePaymentState}
                                           waivePayment={waivePayment}
                                           deletePayment={deletePayment}

      />
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
    fetchLoanSummary          : (loanId) => dispatch(fetchLoanSummaryAction(loanId)),
    // delete payment
    deletePayment             : (paymentId, loanId) => dispatch(deletePaymentAction(paymentId, loanId)),
    resetDeletePaymentState   : () => dispatch(resetDeletePaymentState()),
    // waive payment
    waivePayment              : (waivePaymentContext) => dispatch(waivePaymentAction(waivePaymentContext)),
    resetWaivePaymentState    : () => dispatch(resetWaivePaymentState()),
  }
}

function mapStateToProps(state) {
  const { loanSummaryState, deletePaymentState, waivePaymentState } = state

  return {
    loanSummaryState,
    deletePaymentState,
    waivePaymentState,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoanSummaryAdmin)
