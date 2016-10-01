import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { selectPaymentStatus, selectPaymentYear } from '../../redux/actions/member/memberAction'
import { LoanSummaryContent } from '../../components/admin/loanSummary/LoanSummaryContent'
import {fetchLoanSummaryAction} from "../../redux/actions/admin/fetchLoanSummary";

class LoanSummaryAdmin extends Component {

  constructor(props) {
    super(props)

    this.tabList = ["All", "Complete", "Pending"];
  }

  componentDidMount() {
    const { fetchLoanSummary } = this.props
    const { loanId } = this.props.params
    fetchLoanSummary(loanId)
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

  render() {
    const { loanSummaryState } = this.props
    const { loanId } = this.props.params


    // const { paymentDataForSelectedLoan,
    //   paymentsToDisplay,
    //    } = this.getPaymentRenderData(loanId, loanData, paymentState)
    //
    // const paymentsData = {
    //   isFetching: paymentState.isFetching,
    //   fetchPaymentsFailed: paymentState.fetchPaymentsFailed,
    //   loanId: loanId,
    //   loanNumber: loanNumber,
    //   paymentSchedule: paymentDataForSelectedLoan.paymentSchedule,
    //   paymentList: paymentsToDisplay,
    //   selectedPaymentYear: paymentDataForSelectedLoan.selectedPaymentYear,
    //   paymentYearsList: paymentDataForSelectedLoan.paymentYearsList || [],
    //   selectedPaymentStatus: paymentState.selectedPaymentStatus
    // }

    return (
      <div>
        <LoanSummaryContent isFetching={loanSummaryState.isFetching}
                            isFetchFailed={loanSummaryState.isFetchFailed}
                            loanSummary={loanSummaryState.loanSummary}
        />
      </div>
    )
  }
}

LoanSummaryAdmin.propTypes = {
  loanSummaryState: PropTypes.object.isRequired
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchLoanSummary: (loanId) => dispatch(fetchLoanSummaryAction(loanId)),
  }
}

function mapStateToProps(state) {
  const { loanSummaryState } = state

  return {
    loanSummaryState,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoanSummaryAdmin)
