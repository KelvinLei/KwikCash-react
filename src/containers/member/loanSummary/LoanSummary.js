import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { selectPaymentStatus, selectPaymentYear } from '../../../redux/actions/member/memberAction'
import LoanSummaryContent from '../../../components/member/loanSummary/LoanSummaryContent'
import {fetchPaymentsAction} from "../../../redux/actions/member/fetchPayments";

class LoanSummary extends Component {

  constructor(props) {
    super(props)

    // only ACTIVE, MANUAL, PLAN loans can payoff
    this.CAN_PAYOFF_STATUS_SET = new Set(['A', 'M', 'F'])

    this.tabList = ["All", "Complete", "Pending"];
  }

  componentDidMount() {
    const { fetchPayments } = this.props
    const { loanId } = this.props.params
    fetchPayments(loanId)
  }

  filterPaymentsForDisplay(paymentList, paymentYear, paymentStatus) {
    return paymentList.filter(
      (payment) => {
        let matchSelectedStatus
        if (paymentStatus == 'All') {
          matchSelectedStatus = true
        }
        else if (paymentStatus == 'Complete') {
          matchSelectedStatus = payment.isPaid
        }
        else if (paymentStatus == 'Pending') {
          matchSelectedStatus = !payment.isPaid
        }
        else {
          matchSelectedStatus = false
        }

        const matchSelectedPaymentYear = paymentYear == 'All' || payment.paymentDate.slice(0, 4) == paymentYear

        return matchSelectedStatus && matchSelectedPaymentYear
      }
    )
  }

  generatePaymentsProgressData(paymentList) {
    const completePayments = paymentList.filter( (payment) => payment.isPaid )
    return {
      completePercentage: (completePayments.length/paymentList.length * 100).toFixed(2),
      pendingPercentage: ((paymentList.length - completePayments.length)/paymentList.length * 100).toFixed(2),
      completePaymentsCount: completePayments.length,
      pendingPaymentsCount: paymentList.length - completePayments.length
    }
  }

  render() {
    const { loans, paymentState, handleSelectPaymentTab, handleSelectPaymentYear } = this.props
    const { loanId } = this.props.params

    const loanData = loans.find( (loan) => loan.loanId == loanId)

    // only ACTIVE loans can refinance
    const shouldDisplayRefinance = loanData.loanCode === 'A'

    const shouldDisplayPayoff = this.CAN_PAYOFF_STATUS_SET.has(loanData.loanCode)

    const paymentListForSelectedLoan =
      !paymentState.isFetching && !paymentState.fetchPaymentsFailed && paymentState.payments[loanData.loanId]
        ? paymentState.payments[loanData.loanId]
        : []

    const paymentsToDisplay = this.filterPaymentsForDisplay(
      paymentListForSelectedLoan,
      paymentState.selectedPaymentYear,
      paymentState.selectedPaymentStatus
    )

    const paymentsProgressData = this.generatePaymentsProgressData(paymentListForSelectedLoan)

    const paymentsData = {
      isFetching: paymentState.isFetching,
      fetchPaymentsFailed: paymentState.fetchPaymentsFailed,
      paymentList: paymentsToDisplay,
      selectedPaymentYear: paymentState.selectedPaymentYear,
      paymentYearsList: paymentState.paymentYearsList,
      selectedPaymentStatus: paymentState.selectedPaymentStatus
    }

    return (
      <div>
        <LoanSummaryContent loanData={loanData}
                            paymentsData={paymentsData}
                            paymentsProgressData={paymentsProgressData}
                            shouldDisplayRefinance={shouldDisplayRefinance}
                            shouldDisplayPayoff={shouldDisplayPayoff}
                            tabList={this.tabList}
                            onClickPaymentTab={handleSelectPaymentTab}
                            onClickPaymentYear={handleSelectPaymentYear}
        />
      </div>
    )
  }
}

LoanSummary.propTypes = {
  loans: PropTypes.array.isRequired,
  paymentState: PropTypes.object.isRequired
}

const mapDispatchToProps = (dispatch) => {
  return {
    // triggered when loan summary component is rendered
    fetchPayments: (loanId) => dispatch(fetchPaymentsAction(loanId)),

    // triggered when payment status tab is clicked
    handleSelectPaymentTab: (selectedTab) => dispatch(selectPaymentStatus(selectedTab)),

    // triggered when payment year dropdown is selected
    handleSelectPaymentYear: (year) => dispatch(selectPaymentYear(year))
  }
}

function mapStateToProps(state) {
  const { paymentState } = state
  const loans = state.loanList.loans

  return {
    loans,
    paymentState
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoanSummary)
