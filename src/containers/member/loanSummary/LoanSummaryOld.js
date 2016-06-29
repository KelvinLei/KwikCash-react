import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import LoanSummaryContent from '../../../components/member/loanSummary/LoanSummaryContent'

class LoanSummaryOld extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    const { currentBalance } = this.props
    
    return (
      <div>
        <LoanSummaryContent currentBalance={currentBalance}/>
      </div>
    )
  }
}

LoanSummaryOld.propTypes = {
  currentBalance: PropTypes.string.isRequired
}

function mapStateToProps(state) {
  const currentBalance = "3000.00" // state.currentBalance || "unknown"

  return {
    currentBalance
  }
}

export default connect(
  mapStateToProps
)(LoanSummaryOld)
