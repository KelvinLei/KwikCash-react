import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import PaymentPlanTable from '../../../components/member/paymentInfo/PaymentPlanTable'
import PaymentStatusTabs from '../../../components/member/paymentInfo/PaymentStatusTabs'
import PayOffButton from '../../../components/member/paymentInfo/PayOffButton'
import {selectPaymentStatus} from '../../../redux/actions/member/memberAction'

class PaymentInfo extends Component {

  constructor(props) {
    super(props)
    this.handleSelectPaymentTab = this.handleSelectPaymentTab.bind(this)
  }

  handleSelectPaymentTab(selectedTab) {
    this.props.dispatch(selectPaymentStatus(selectedTab))
  }

  render() {
    const tabList = ["All", "Complete", "Pending"];

    const {selectedPaymentStatusToShow, paymentList} = this.props;

    return (
      <div>
        <h2>Payment Plan</h2>

        <PayOffButton/>

        <PaymentStatusTabs tabList={tabList} selectedTab={selectedPaymentStatusToShow} onClick={this.handleSelectPaymentTab}/>

        <PaymentPlanTable paymentList={paymentList} selectedTab={selectedPaymentStatusToShow}/>
      </div>
    )
  }
}

PaymentInfo.propTypes = {
  selectedPaymentStatusToShow: PropTypes.string.isRequired,
  paymentList: PropTypes.array.isRequired
}

function mapStateToProps(state) {
  const selectedPaymentStatusToShow = state.selectedPaymentStatusToShow || "all"

  const paymentList = [
    {id: 1, status: "Complete", dueDate: "06/01/2016", amount: "500"},
    {id: 2, status: "Pending", dueDate: "07/01/2016", amount: "600"},
    {id: 3, status: "Pending", dueDate: "08/01/2016", amount: "800"},
    {id: 4, status: "Pending", dueDate: "09/01/2016", amount: "800"},
    {id: 5, status: "Pending", dueDate: "10/01/2016", amount: "800"},
    {id: 6, status: "Pending", dueDate: "11/01/2016", amount: "800"},
    {id: 7, status: "Pending", dueDate: "12/01/2016", amount: "800"},
    {id: 8, status: "Pending", dueDate: "12/02/2016", amount: "800"},
    {id: 9, status: "Pending", dueDate: "12/03/2016", amount: "800"}
  ];

  return {
    selectedPaymentStatusToShow,
    paymentList
  }
}

export default connect(mapStateToProps)(PaymentInfo)
