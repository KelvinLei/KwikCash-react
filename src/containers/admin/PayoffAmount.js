import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { PayoffContent } from '../../components/admin/payoff/PayoffContent'
import { LoadingSpinner } from '../../components/shared/LoadingSpinner'
import { FailureWidget } from '../../components/shared/FailureWidget'
import {fetchPayoffAction} from "../../redux/actions/admin/fetchPayoff";

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
    const { payoffState } = this.props

    let displayContent
    if (payoffState.isFetching) {
      displayContent = <LoadingSpinner/>
    }
    else if (payoffState.isFetchFailed) {
      displayContent = <FailureWidget/>
    }
    else {
      displayContent = <PayoffContent payoff={payoffState.payoff}/>
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
  }
}

function mapStateToProps(state) {
  const { payoffState } = state

  return {
    payoffState,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PayoffAmount)
