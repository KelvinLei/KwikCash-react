import React, { Component } from 'react'
import PaymentPlanRow from './PaymentPlanRow'

export default class PaymentPlanTable extends Component {
  render() {
    const { paymentList, selectedTab } = this.props;

    function filterPayment(payment) {
      return selectedTab === "all" ? true : payment.state.toLowerCase().match(selectedTab)
    }

    var paymentListContent = paymentList.filter(filterPayment).map(payment => {
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
