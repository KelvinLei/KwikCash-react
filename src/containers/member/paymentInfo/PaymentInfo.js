import React, { Component } from 'react'
import PaymentPlanTable from '../../../components/member/paymentInfo/PaymentPlanTable'

export default class PaymentInfo extends Component {
  render() {

    var data = [
      {id: 1, status: "Complete", dueDate: "06/01/2016", amount: "500"},
      {id: 2, status: "Pending", dueDate: "07/01/2016", amount: "600"},
      {id: 3, status: "Pending", dueDate: "08/01/2016", amount: "800"}
    ];

    return (
      <div>
        <PaymentPlanTable paymentList={data}/>
      </div>
    )
  }
}
