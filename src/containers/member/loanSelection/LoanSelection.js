import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import LoanSelectionContent from '../../../components/member/loanSelection/LoanSelectionContent'

export default class LoanSelection extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    // const { loanList } = this.props;

    const { loanId } = this.props.params

    const loanList = [
        {"id": 1234, "status": "Active", "currentBalance": 3000.00, "APR": "4.00", "nextPaymentDate": "06/01/2016"},
        {"id": 5342, "status": "Active", "currentBalance": 4000.00, "APR": "5.00", "nextPaymentDate": "06/15/2016"},
        {"id": 1534, "status": "Complete", "currentBalance": 0, "APR": "6.00", "nextPaymentDate": ""}
      ]

    return (
      <div>
        <LoanSelectionContent loanList={loanList}/>
      </div>
    )
  }
}

// LoanSelection.propTypes = {
//   loanList: PropTypes.object.isRequired
// }
//
// function mapStateToProps(state) {
//   const currentBalance = "3000.00" // state.currentBalance || "unknown"
//
//   return {
//     currentBalance
//   }
// }
//
// export default connect(
//   mapStateToProps
// )(LoanSelection)
