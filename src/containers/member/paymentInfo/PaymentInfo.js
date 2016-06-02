import React, { Component } from 'react'
import PaymentPlanTable from '../../../components/member/paymentInfo/PaymentPlanTable'
import PaymentStatusTabs from '../../../components/member/paymentInfo/PaymentStatusTabs'

export default class PaymentInfo extends Component {
  render() {

    var data = [
      {id: 1, status: "Complete", dueDate: "06/01/2016", amount: "500"},
      {id: 2, status: "Pending", dueDate: "07/01/2016", amount: "600"},
      {id: 3, status: "Pending", dueDate: "08/01/2016", amount: "800"}
    ];

    var tabList = ["All", "Complete", "Pending"];

    return (
      <div>
        <h2>Payment Plan</h2>

        <PaymentStatusTabs tabList={tabList}/>

        <PaymentPlanTable paymentList={data}/>
      </div>
    )
  }
}
