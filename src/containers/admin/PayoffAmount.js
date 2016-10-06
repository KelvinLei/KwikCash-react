import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { PayoffContent } from '../../components/admin/payoff/PayoffContent'
import { LoadingSpinner } from '../../components/shared/LoadingSpinner'
import { FailureWidget } from '../../components/shared/FailureWidget'
import {fetchPayoffAction} from "../../redux/actions/admin/fetchPayoff";
import {getPayoffFormAction} from "../../redux/actions/admin/getPayoffAuth";

class PayoffAmount extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { fetchPayoff } = this.props
    const { loanId } = this.props.params
    fetchPayoff(loanId)
  }

  render() {
    const { payoffState, getPayoffFormState, getPayoffForm } = this.props
    const { loanId } = this.props.params
    
    let displayContent
    if (payoffState.isFetching) {
      displayContent = <LoadingSpinner/>
    }
    else if (payoffState.isFetchFailed) {
      displayContent = <FailureWidget/>
    }
    else {
      displayContent = <PayoffContent loanId={loanId}
                                      payoff={payoffState.payoff} 
                                      getPayoffFormState={getPayoffFormState}
                                      getPayoffForm={getPayoffForm}
      />
    }

    return (
      <div>
        { displayContent }
      </div>
    )
  }
}

PayoffAmount.propTypes = {
  payoffState: PropTypes.object.isRequired
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchPayoff: (loanId) => dispatch(fetchPayoffAction(loanId)),
    getPayoffForm: (loanId) => dispatch(getPayoffFormAction(loanId)),
  }
}

function mapStateToProps(state) {
  const { payoffState, getPayoffFormState } = state

  return {
    payoffState,
    getPayoffFormState,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PayoffAmount)
