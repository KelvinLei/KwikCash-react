import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {selectPaymentStatus} from '../../../redux/actions/member/memberAction'
import PaymentPlanContent from '../../../components/member/paymentInfo/PaymentPlanContent'

class PaymentInfo extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    const tabList = ["All", "Complete", "Pending"];

    const {selectPaymentStatus, paymentList} = this.props;

    return (
      <div>
        <PaymentPlanContent
          tabList={tabList}
          selectedTab={selectPaymentStatus}
          paymentList={paymentList}
          onClickPaymentTab={this.props.handleSelectPaymentTab}
        />
      </div>
    )
  }
}

PaymentInfo.propTypes = {
  selectPaymentStatus: PropTypes.string.isRequired,
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
  const selectPaymentStatus = state.selectPaymentStatus || "all"

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
    selectPaymentStatus,
    paymentList
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PaymentInfo)
