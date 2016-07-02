import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {selectPaymentStatus} from '../../../redux/actions/member/memberAction'
import LoanSummaryContent from '../../../components/member/loanSummary/LoanSummaryContent'

class LoanSummary extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    const { currentBalance, selectedPaymentStatus, paymentList } = this.props
    const { loanId } = this.props.params
    const tabList = ["All", "Complete", "Pending"];

    return (
      <div>
        <LoanSummaryContent loanId={loanId}
                            currentBalance={currentBalance}
                            tabList={tabList}
                            selectedPaymentStatus={selectedPaymentStatus}
                            paymentList={paymentList}
                            onClickPaymentTab={this.props.handleSelectPaymentTab}
        />
      </div>
    )
  }
}

LoanSummary.propTypes = {
  currentBalance: PropTypes.string.isRequired,
  selectedPaymentStatus: PropTypes.string.isRequired,
  paymentList: PropTypes.array.isRequired
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleSelectPaymentTab: (selectedTab) => {
      dispatch(selectPaymentStatus(selectedTab))
    }
  }
}

function mapStateToProps(state) {
  const currentBalance = "3000.00" // state.currentBalance || "unknown"

  const selectedPaymentStatus = state.selectedPaymentStatus || "all"

  const paymentList = [
    {id: 1, status: "Complete", dueDate: "06/01/2016", amount: "500"},
    {id: 2, status: "Complete", dueDate: "07/01/2016", amount: "600"},
    {id: 3, status: "Complete", dueDate: "08/01/2016", amount: "800"},
    {id: 4, status: "Pending", dueDate: "09/01/2016", amount: "800"},
    {id: 5, status: "Pending", dueDate: "10/01/2016", amount: "800"},
    {id: 6, status: "Pending", dueDate: "11/01/2016", amount: "800"},
    {id: 7, status: "Pending", dueDate: "12/01/2016", amount: "800"},
    {id: 8, status: "Pending", dueDate: "12/02/2016", amount: "800"},
    {id: 9, status: "Pending", dueDate: "12/03/2016", amount: "800"},
    {id: 10, status: "Pending", dueDate: "12/04/2016", amount: "800"},
    {id: 11, status: "Pending", dueDate: "12/05/2016", amount: "800"},
    {id: 12, status: "Pending", dueDate: "12/06/2016", amount: "800"},
    {id: 13, status: "Pending", dueDate: "12/07/2016", amount: "800"},
    {id: 14, status: "Pending", dueDate: "12/08/2016", amount: "800"}
  ];

  return {
    currentBalance,
    selectedPaymentStatus,
    paymentList
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoanSummary)
