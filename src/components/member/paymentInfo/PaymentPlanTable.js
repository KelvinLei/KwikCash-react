import React, { Component } from 'react'
import PaymentPlanRow from './PaymentPlanRow'

export default class PaymentPlanTable extends Component {
  render() {
    const { paymentList } = this.props;

    var paymentListContent = paymentList.map( payment => {
      return (
        <PaymentPlanRow key={payment.id} status={payment.status} dueDate={payment.dueDate} amount={payment.amount}/>
      )
    });

    return (
      <div>
        <table class="table table-striped table-hover ">
          <thead>
          <tr>
            <th>Status</th>
            <th>Due Date</th>
            <th>Payment</th>
          </tr>
          </thead>

          <tbody>
            {paymentListContent}
          </tbody>
        </table>
      </div>
    )
  }
}
