import React, { Component } from 'react'

export default class PaymentPlanRow extends Component {
  render() {
    const { index, status, dueDate, amount } = this.props;

    var amountText = "$" + amount;

    var className = status === "Complete" ? "success" : "warning"

    return (
      <tr className={className}>
        <td>{index}</td>
        <td>{status}</td>
        <td>{dueDate}</td>
        <td>{amountText}</td>
      </tr>
    )
  }
}
