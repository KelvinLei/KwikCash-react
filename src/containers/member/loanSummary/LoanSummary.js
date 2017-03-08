import React, { Component } from 'react'
import { connect } from 'react-redux'
import { selectPaymentStatus, selectPaymentYear } from '../../../redux/actions/member/memberAction'
import LoanSummaryContent from '../../../components/member/loanSummary/LoanSummaryContent'
import { fetchPaymentsAction } from "../../../redux/actions/member/fetchPayments"
import { sendPayoffRequest } from "../../../../src/api/memberApiClient"
import {fetchGetUserDataAction} from "../../../redux/actions/member/fetchUserData";
import {fetchLoanListAction} from "../../../redux/actions/member/fetchLoanList";

class LoanSummary extends Component {

  constructor(props) {
    super(props)

    this.tabList = ["All", "Complete", "Pending", "Payoff"];
  }

  componentDidMount() {
    const { loans, paymentState, fetchPayments, fetchUserData, fetchLoanList } = this.props
    const { loanId } = this.props.params
    fetchPayments(loanId)
    fetchUserData()
    fetchLoanList()

    // only shows payoff tab for loans that are not paid nor charged off
    const loanData = loans.find( (loan) => loan.loanId == loanId)
    if (!this.shouldDisplayPayoffTab(loanData)) {
      this.tabList = ["All", "Complete", "Pending"];
    }
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

  generatePaymentsProgressData(loanData) {
    const amountPaid = (loanData.loanFundAmount - loanData.balance).toFixed(2)
    const amountRemaining = (loanData.loanFundAmount - amountPaid).toFixed(2)
    return {
      completePercentage: ((amountPaid/loanData.loanFundAmount) * 100).toFixed(2),
      amountRemaining,
      amountPaid
    }
  }

  getPaymentRenderData(loanId, loanData, paymentState) {
    let paymentDataForSelectedLoan
    let paymentsToDisplay
    let paymentsProgressData
    // ensure there's no ongoing fetchPayment request and paymentsDataMap has payments data for selected loan
    if (loanData && !paymentState.isFetching && !paymentState.fetchPaymentsFailed && paymentState.paymentsDataMap.has(loanId)) {
      paymentDataForSelectedLoan = paymentState.paymentsDataMap.get(loanId)
      const selectedPaymentStatus = this.shouldOverridePayoffState(loanData, paymentState) ? 'All' : paymentState.selectedPaymentStatus

      paymentsToDisplay = this.filterPaymentsForDisplay(
        paymentDataForSelectedLoan.paymentList,
        paymentDataForSelectedLoan.selectedPaymentYear,
        selectedPaymentStatus
      )
      paymentsProgressData = this.generatePaymentsProgressData(loanData)
    }
    else {
      paymentDataForSelectedLoan = {}
      paymentsToDisplay = []
      paymentsProgressData = {completePercentage : 'N/A'}
    }

    return {
      paymentDataForSelectedLoan,
      paymentsToDisplay,
      paymentsProgressData
    }
  }

  /**
   * Show refinance button if clients are in CA and have active loans with 0 - 30 remaining payments for all rate
   */
  shouldDisplayRefinanceButton(loanData, paymentList, userData) {
    // only ACTIVE loans and CA users can refinance
    if (!loanData || !paymentList || !userData || loanData.loanCode != 'A' || userData.state != 'CA') {
      return false
    }

    const rate = parseInt(loanData.loanRate)
    if (loanData.remainingPayments > 30) {
      return false
    }
    // else if (loanData.remainingPayments > 12) {
    //   return rate > 35 && rate < 60
    // }
    else {
      return true
    }
  }

  /**
   * Allows payoff request
   * for MANUAL, PLAN loans for all rates.
   * for ACTIVE loans whose rate is within 36-59%
   * @param loanData
   */
  shouldDisplayPayoffBtn(loanData) {
    if (!loanData) {
      return false
    }

    const rate = parseInt(loanData.loanRate)
    const isManualOrPlan = loanData.loanCode == 'M' || loanData.loanCode == 'F'
    const isActiveAndProperRate = loanData.loanCode == 'A' && 35 < rate && rate < 60
    return isManualOrPlan || isActiveAndProperRate
  }

  shouldDisplayPayoffTab(loanData) {
    if (!loanData) {
      return false
    }
    return loanData.loanCode != 'P' && loanData.loanCode != 'D'
  }

  /**
   * Override payoff state to normal state if selected loan is not eligible to payoff but previously selected loan is eligible
   */
  shouldOverridePayoffState(loanData, paymentState) {
    return !this.shouldDisplayPayoffTab(loanData) && paymentState.selectedPaymentStatus == 'Payoff'
  }

  render() {
    const { loans, paymentState, handleSelectPaymentTab, handleSelectPaymentYear, userDataState } = this.props
    const { loanId } = this.props.params

    const loanData = loans.find( (loan) => loan.loanId == loanId)
    const loanNumber = loanData ? loanData.loanNumber : ''
    const shouldOverridePayoffState = this.shouldOverridePayoffState(loanData, paymentState)

    const shouldDisplayPayoffBtn = this.shouldDisplayPayoffBtn(loanData)

    const { paymentDataForSelectedLoan,
            paymentsToDisplay,
            paymentsProgressData } = this.getPaymentRenderData(loanId, loanData, paymentState)

    const shouldDisplayRefinance = this.shouldDisplayRefinanceButton(
      loanData,
      paymentDataForSelectedLoan.paymentList,
      userDataState.userData
    )

    const paymentsData = {
      isFetching: paymentState.isFetching,
      fetchPaymentsFailed: paymentState.fetchPaymentsFailed,
      loanId: loanId,
      loanNumber: loanNumber,
      paymentSchedule: paymentDataForSelectedLoan.paymentSchedule,
      paymentList: paymentsToDisplay,
      selectedPaymentYear: paymentDataForSelectedLoan.selectedPaymentYear,
      paymentYearsList: paymentDataForSelectedLoan.paymentYearsList || [],
      // the following avoids errors when payoff tab is selected previously and user switches to a paid/chargedoff loan
      // which disallows payoff tab to show
      selectedPaymentStatus: shouldOverridePayoffState ? 'All' : paymentState.selectedPaymentStatus
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
                            shouldDisplayPayoffBtn={shouldDisplayPayoffBtn}
                            tabList={this.tabList}
                            onClickPaymentTab={handleSelectPaymentTab}
                            onClickPaymentYear={handleSelectPaymentYear}
                            onClickPayoff={sendPayoffRequest}
        />
      </div>
    )
  }
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
