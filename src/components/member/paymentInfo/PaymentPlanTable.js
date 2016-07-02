import React from 'react'
import { Table } from 'react-bootstrap'

export const PaymentPlanTable = ({paymentList, selectedTab}) => {
  const filterPayment = payment => {
    const selectedTabLowerCase = selectedTab.toLowerCase()
    return selectedTabLowerCase === "all" ? true : String(payment.status).toLowerCase().match(selectedTabLowerCase)
  }

  const paymentListContent = paymentList.filter(filterPayment).map((payment, id) => {
    return (
      <PaymentPlanRow key={payment.id}
                      index={id + 1}
                      status={payment.status}
                      dueDate={payment.dueDate}
                      amount={payment.amount}
      />
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

const PaymentPlanRow = ({index, status, dueDate, amount}) => {
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