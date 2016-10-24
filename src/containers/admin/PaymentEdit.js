import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import PaymentEditContent from '../../components/admin/paymentEdit/PaymentEditContent'
import {fetchSinglePaymentAction} from "../../redux/actions/admin/fetchSinglePayment"
import { LoadingSpinner } from '../../components/shared/LoadingSpinner'
import { FailureWidget } from '../../components/shared/FailureWidget'
import {resetEditPaymentAction, editPaymentAction} from "../../redux/actions/admin/editPayment";

class PaymentEdit extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { fetchSinglePayment, resetEditPaymentState } = this.props
    const { paymentId } = this.props.params
    fetchSinglePayment(paymentId)
    resetEditPaymentState()
  }

  render() {
    const { fetchSinglePaymentState, editPaymentState, editPayment } = this.props
    const { isFetching, isFailed, payment } = fetchSinglePaymentState

    let displayContent
    if (isFetching) {
      displayContent = <LoadingSpinner/>
    }
    else if (isFailed) {
      displayContent = <FailureWidget/>
    }
    else {
      displayContent = <PaymentEditContent payment={payment}
                                           editPaymentState={editPaymentState}
                                           editPayment={editPayment}
      />
    }

    return (
      <div>
        { displayContent }
      </div>
    )
  }
}

PaymentEdit.propTypes = {
  fetchSinglePaymentState: PropTypes.object.isRequired
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchSinglePayment: (paymentId) => dispatch(fetchSinglePaymentAction(paymentId)),
    
    editPayment: (editPaymentContext) => dispatch(editPaymentAction(editPaymentContext)),
    resetEditPaymentState: () => dispatch(resetEditPaymentAction()),
  }
}

function mapStateToProps(state) {
  const { fetchSinglePaymentState, editPaymentState } = state

  return {
    fetchSinglePaymentState,
    editPaymentState,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaymentEdit)
