import React, { Component } from 'react'
import PaymentPlanRow from './PaymentPlanRow'
import { Table } from 'react-bootstrap'

import styles from './PaymentInfo.scss'

export default class PaymentPlanTable extends Component {

  render() {
    const { paymentList, selectedTab } = this.props;

    function filterPayment(payment) {
      const selectedTabLowerCase = selectedTab.toLowerCase()
      return selectedTabLowerCase === "all" ? true : String(payment.status).toLowerCase().match(selectedTabLowerCase)
    }

    var paymentListContent = paymentList.filter(filterPayment).map((payment, id) => {
      return (
        <PaymentPlanRow key={payment.id} index={id + 1} status={payment.status} dueDate={payment.dueDate} amount={payment.amount}/>
      )
    })

    return (
      <Table id="paymentPlantTable" responsive striped hover>
        <thead>
        <tr>
          <th className="sort-numeric">#</th>
          <th className="sort-alpha">Status</th>
          <th className="sort-numeric">Due Date</th>
          <th className="sort-numeric">Payment</th>
        </tr>
        </thead>

        <tbody>
          {paymentListContent}
        </tbody>
      </Table>
    )
  }
}
