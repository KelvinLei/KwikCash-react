import React, { Component } from 'react'

export default class PaymentPlanRow extends Component {
  render() {
    const { status, dueDate, amount } = this.props;

    var amountText = "$" + amount;

    return (
      <tr>
        <td>{status}</td>
        <td>{dueDate}</td>
        <td>{amountText}</td>
      </tr>
    )
  }
}
