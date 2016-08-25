import React from 'react'
import { Table } from 'react-bootstrap'

export const PaymentPlanTable = ({paymentList}) => {
  const paymentListContent = paymentList.map((payment, index) => {
    const { id,
            isPaid,
            paymentDate,
            amountDue,
            amountPaid,
            scheduled,
            principal,
            interest } = payment

    const scheduleType = scheduled == 'Y' ? 'Scheduled' : 'Manual'

    return (
      <PaymentPlanRow key={id}
                      index={index + 1}
                      status={ isPaid ? 'Complete' : 'Pending'}
                      dueDate={paymentDate}
                      amountDue={amountDue}
                      amountPaid={amountPaid}
                      scheduleType={scheduleType}
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
        <th className="sort-numeric">Due</th>
        <th className="sort-numeric">Paid</th>
        <th className="sort-numeric">Schedule</th>
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

const PaymentPlanRow = ({
  index,
  status,
  dueDate,
  amountDue,
  amountPaid,
  scheduleType,
  principal,
  interest
}) => {
  var className = status === "Complete" ? "label label-success" : "label label-warning"

  return (
    <tr>
      <td>{index}</td>
      <td>
        <div className={className}>{status}</div>
      </td>
      <td>{dueDate}</td>
      <td>{'$' + amountDue}</td>
      <td>{'$' + amountPaid}</td>
      <td>{scheduleType}</td>
      <td>{'$' + principal}</td>
      <td>{'$' + interest}</td>
    </tr>
  )
}