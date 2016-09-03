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
      paymentsToDisplay = this.filterPaymentsForDisplay(
        paymentDataForSelectedLoan.paymentList,
        paymentDataForSelectedLoan.selectedPaymentYear,
        paymentState.selectedPaymentStatus
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
   * For clients that have 24 payments - 12 payments remaining we can show refinance button
   * but only clients who have 36%-59% rates and are in California
   *
   * For clients that have 12 payments or less remaining
   * we can show refinance button for all rates. CA only
   */
  shouldDisplayRefinanceButton(loanData, paymentList, userData) {
    // only ACTIVE loans and CA users can refinance
    if (!loanData || !paymentList || !userData ||
        loanData.loanCode != 'A' || userData.state != 'CA') {
      return false
    }

    const remainingPaymentsCount = this.getRemainingPaymentsCount(paymentList)
    const rate = parseInt(loanData.loanRate)

    if (remainingPaymentsCount > 24) {
      return false
    }
    else if (remainingPaymentsCount > 12) {
      return rate > 35 && rate < 60
    }
    else {
      return true
    }
  }

  getRemainingPaymentsCount(paymentList) {
    const remainingPayments = paymentList.filter( (payment) => {
      const paymentDate = new Date(payment.paymentDate)
      // future payments that are unpaid
      return paymentDate > Date.now() && !payment.isPaid
    })
    return remainingPayments.length
  }

  render() {
    const { loans, paymentState, handleSelectPaymentTab, handleSelectPaymentYear, userDataState } = this.props
    const { loanId } = this.props.params

    const loanData = loans.find( (loan) => loan.loanId == loanId)
    const loanNumber = loanData ? loanData.loanNumber : ''

    const shouldDisplayPayoff = loanData && this.CAN_PAYOFF_STATUS_SET.has(loanData.loanCode)

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
      selectedPaymentStatus: paymentState.selectedPaymentStatus
    }

    const customerName = userDataState.isFetching || userDataState.isFailed
      ? ''
      : userDataState.userData.firstName + ' ' + userDataState.userData.lastName

    const canReapply = true
    
    return (
      <div>
        <LoanSummaryContent loanData={loanData}
                            paymentsData={paymentsData}
                            customerName={customerName}
                            paymentsProgressData={paymentsProgressData}
                            shouldDisplayRefinance={shouldDisplayRefinance}
                            shouldDisplayPayoff={shouldDisplayPayoff}
                            canReapply={canReapply}
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
