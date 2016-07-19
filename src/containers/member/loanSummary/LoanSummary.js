import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {selectPaymentStatus} from '../../../redux/actions/member/memberAction'
import LoanSummaryContent from '../../../components/member/loanSummary/LoanSummaryContent'
import {fetchPaymentsAction} from "../../../redux/actions/member/fetchPayments";

class LoanSummary extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { fetchPayments } = this.props
    const { loanId } = this.props.params
    fetchPayments(loanId)
  }

  render() {
    const { loans, selectedPaymentStatus, paymentState } = this.props
    const { loanId } = this.props.params

    const loanData = loans.find( (loan) => loan.loanId == loanId)

    // only ACTIVE loans can refinance
    const shouldDisplayRefinance = loanData.loanCode === 'A'

    // only ACTIVE, MANUAL, PLAN loans can payoff
    const canPayoffStatusMap = {
      'A': true,
      'M': true,
      'F': true
    }
    const shouldDisplayPayoff = canPayoffStatusMap[loanData.loanCode] == true

    const tabList = ["All", "Complete", "Pending"];

    return (
      <div>
        <LoanSummaryContent loanData={loanData}
                            paymentState={paymentState}
                            shouldDisplayRefinance={shouldDisplayRefinance}
                            shouldDisplayPayoff={shouldDisplayPayoff}
                            tabList={tabList}
                            selectedPaymentStatus={selectedPaymentStatus}
                            onClickPaymentTab={this.props.handleSelectPaymentTab}
        />
      </div>
    )
  }
}

LoanSummary.propTypes = {
  loans: PropTypes.array.isRequired,
  selectedPaymentStatus: PropTypes.string.isRequired,
  paymentState: PropTypes.object.isRequired
}

const mapDispatchToProps = (dispatch) => {
  return {
    // triggered when payment status tab is clicked
    handleSelectPaymentTab: (selectedTab) => dispatch(selectPaymentStatus(selectedTab)),

    // triggered when loan summary component is rendered
    fetchPayments: (loanId) => dispatch(fetchPaymentsAction(loanId))
  }
}

function mapStateToProps(state) {
  const { selectedPaymentStatus, paymentState } = state
  const loans = state.loanList.loans

  return {
    loans,
    selectedPaymentStatus,
    paymentState
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoanSummary)
