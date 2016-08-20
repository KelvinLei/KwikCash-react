import React from 'react'
import { Table } from 'react-bootstrap'

export const PaymentPlanTable = ({paymentList}) => {
  const paymentListContent = paymentList.map((payment, index) => {
    const { id,
            isPaid,
            paymentDate,
            amountDue,
            principal,
            interest } = payment

    return (
      <PaymentPlanRow key={id}
                      index={index + 1}
                      status={ isPaid ? 'Complete' : 'Pending'}
                      dueDate={paymentDate}
                      amount={amountDue}
                      principal={principal}
                      interest={interest}
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
        <th className="sort-numeric">Amount</th>
        <th className="sort-numeric">Principal</th>
        <th className="sort-numeric">Interest</th>
      </tr>
      </thead>

      <tbody>
      {paymentListContent}
      </tbody>
    </Table>
  )
}

const PaymentPlanRow = ({index, status, dueDate, amount, principal, interest}) => {
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
      <td>{principal}</td>
      <td>{interest}</td>
    </tr>
  )
}