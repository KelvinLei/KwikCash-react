import React, { Component } from 'react'

export default class PaymentPlanRow extends Component {
  render() {
    const { index, status, dueDate, amount } = this.props;

    var amountText = "$" + amount;

    var className = status === "Complete" ? "label label-success" : "label label-warning"

    return (
      <tr>
        <td>{index}</td>
        <td>
          <div className={className}>{status}</div>
        </td>
        <td>{dueDate}</td>
        <td>{amountText}</td>
      </tr>
    )
  }
}
