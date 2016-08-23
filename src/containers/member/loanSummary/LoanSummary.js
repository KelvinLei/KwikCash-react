import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { selectPaymentStatus, selectPaymentYear } from '../../../redux/actions/member/memberAction'
import LoanSummaryContent from '../../../components/member/loanSummary/LoanSummaryContent'
import { fetchPaymentsAction } from "../../../redux/actions/member/fetchPayments"
import { sendPayoffRequest } from "../../../../src/api"
import {fetchGetUserDataAction} from "../../../redux/actions/member/fetchUserData";
import {fetchLoanListAction} from "../../../redux/actions/member/fetchLoanList";

class LoanSummary extends Component {

  constructor(props) {
    super(props)

    // only ACTIVE, MANUAL, PLAN loans can payoff
    this.CAN_PAYOFF_STATUS_SET = new Set(['A', 'M', 'F'])

    this.tabList = ["All", "Complete", "Pending"];
  }

  componentDidMount() {
    const { fetchPayments, fetchUserData, fetchLoanList } = this.props
    const { loanId } = this.props.params
    fetchPayments(loanId)
    fetchUserData()
    fetchLoanList()
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

  generatePaymentsProgressData(paymentList, loanData) {
    const completePayments = paymentList.filter( (payment) => payment.isPaid )
    const fundAmount = loanData.loanFundAmount;
    const amountPayed = loanData.loanFundAmount - loanData.balance;
    return {
      completePercentage: (completePayments.length/paymentList.length * 100).toFixed(2),
      pendingPercentage: ((paymentList.length - completePayments.length)/paymentList.length * 100).toFixed(2),
      completePaymentsCount: completePayments.length,
      pendingPaymentsCount: paymentList.length - completePayments.length,
      fundAmount,
      amountPayed
    }
  }

  render() {
    const { loans, paymentState, handleSelectPaymentTab, handleSelectPaymentYear, userDataState } = this.props
    const { loanId } = this.props.params

    const loanData = loans.find( (loan) => loan.loanId == loanId)

    // only ACTIVE loans can refinance
    const shouldDisplayRefinance = loanData && loanData.loanCode === 'A'

    const shouldDisplayPayoff = loanData && this.CAN_PAYOFF_STATUS_SET.has(loanData.loanCode)

    let paymentDataForSelectedLoan
    let paymentsToDisplay
    let paymentsProgressData
    // ensure there's no ongoing fetchPayment request and paymentsDataMap has payments data for selected loan
    if (loanData && !paymentState.isFetching && !paymentState.fetchPaymentsFailed && paymentState.paymentsDataMap.has(loanId)) {
      paymentDataForSelectedLoan = paymentState.paymentsDataMap.get(loanId)
      paymentsToDisplay = this.filterPaymentsForDisplay(
        paymentDataForSelectedLoan.paymentList,
        paymentDataForSelectedLoan.selectedPaymentYear,
        paymentState.selectedPaymentStatus
      )
      paymentsProgressData = this.generatePaymentsProgressData(paymentDataForSelectedLoan.paymentList, loanData)
    }
    else {
      paymentDataForSelectedLoan = {}
      paymentsToDisplay = []
      paymentsProgressData = {completePercentage : 'N/A'}
    }

    const paymentsData = {
      isFetching: paymentState.isFetching,
      fetchPaymentsFailed: paymentState.fetchPaymentsFailed,
      loanId: loanId,
      paymentSchedule: paymentDataForSelectedLoan.paymentSchedule,
      paymentList: paymentsToDisplay,
      selectedPaymentYear: paymentDataForSelectedLoan.selectedPaymentYear,
      paymentYearsList: paymentDataForSelectedLoan.paymentYearsList || [],
      selectedPaymentStatus: paymentState.selectedPaymentStatus
    }

    const customerName = userDataState.isFetching || userDataState.isFailed
      ? ''
      : userDataState.userData.firstName + ' ' + userDataState.userData.lastName

    return (
      <div>
        <LoanSummaryContent loanData={loanData}
                            paymentsData={paymentsData}
                            customerName={customerName}
                            paymentsProgressData={paymentsProgressData}
                            shouldDisplayRefinance={shouldDisplayRefinance}
                            shouldDisplayPayoff={shouldDisplayPayoff}
                            tabList={this.tabList}
                            onClickPaymentTab={handleSelectPaymentTab}
                            onClickPaymentYear={handleSelectPaymentYear}
                            onClickPayoff={sendPayoffRequest}
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
    fetchLoanList: () => dispatch(fetchLoanListAction()),

    // triggered when loan summary component is rendered
    fetchPayments: (loanId) => dispatch(fetchPaymentsAction(loanId)),

    // triggered when payment status tab is clicked
    handleSelectPaymentTab: (selectedTab) => dispatch(selectPaymentStatus(selectedTab)),

    // triggered when payment year dropdown is selected
    handleSelectPaymentYear: (year, loanId) => dispatch(selectPaymentYear(year, loanId)),

    fetchUserData: () => dispatch(fetchGetUserDataAction()),
  }
}

function mapStateToProps(state) {
  const { paymentState, userDataState } = state
  const loans = state.loanList.loans

  return {
    loans,
    paymentState,
    userDataState
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoanSummary)
