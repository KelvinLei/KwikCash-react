import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {selectPaymentStatus} from '../../../redux/actions/member/memberAction'
import LoanSummaryContent from '../../../components/member/loanSummary/LoanSummaryContent'
import {fetchPaymentsAction} from "../../../redux/actions/member/fetchPayments";

class LoanSummary extends Component {

  constructor(props) {
    super(props)

    // only ACTIVE, MANUAL, PLAN loans can payoff
    this.CAN_PAYOFF_STATUS_SET = new Set(['A', 'M', 'F'])

    this.tabList = ["All", "Complete", "Pending"];

    this.filterPaymentsForDisplay = (paymentList, selectedPaymentYear) => {
      return paymentList.filter(
        (payment) => payment.loanpayment_date.slice(0, 4) == selectedPaymentYear
      )
    }
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

    const shouldDisplayPayoff = this.CAN_PAYOFF_STATUS_SET.has(loanData.loanCode)

    const paymentListForSelectedLoan = !paymentState.isFetching && !paymentState.fetchPaymentsFailed && paymentState.payments[loanData.loanId]
      ? paymentState.payments[loanData.loanId]
      : []

    const paymentsToDisplay = this.filterPaymentsForDisplay(paymentListForSelectedLoan, paymentState.selectedPaymentYear)

    const paymentsData = {
      isFetching: paymentState.isFetching,
      fetchPaymentsFailed: paymentState.fetchPaymentsFailed,
      paymentList: paymentsToDisplay,
      selectedPaymentYear: paymentState.selectedPaymentYear,
      paymentYearsList: paymentState.paymentYearsList
    }

    return (
      <div>
        <LoanSummaryContent loanData={loanData}
                            paymentsData={paymentsData}
                            shouldDisplayRefinance={shouldDisplayRefinance}
                            shouldDisplayPayoff={shouldDisplayPayoff}
                            tabList={this.tabList}
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
