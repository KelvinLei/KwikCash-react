import React from 'react'
import { Table } from 'react-bootstrap'

export const PaymentPlanTable = ({paymentList, selectedTab}) => {
  const filterPayment = payment => {
    const selectedTabLowerCase = selectedTab.toLowerCase()
    return selectedTabLowerCase === "all" ? true : String(payment.status).toLowerCase().match(selectedTabLowerCase)
  }

  const paymentListContent = paymentList.filter(filterPayment).map((payment, id) => {
    const { loanpayment_id, 
            loanpayment_type, 
            loanpayment_date, 
            loanpayment_due, 
            loanpayment_principal, 
            loanpayment_interest, 
            loanpayment_rate } = payment
    
    return (
      <PaymentPlanRow key={loanpayment_id}
                      index={id + 1}
                      status={loanpayment_type}
                      dueDate={loanpayment_date}
                      amount={loanpayment_due}
                      principal={loanpayment_principal}
                      interest={loanpayment_interest}
                      rate={loanpayment_rate}
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
        <th className="sort-numeric">Rate</th>
      </tr>
      </thead>

      <tbody>
      {paymentListContent}
      </tbody>
    </Table>
  )
}

const PaymentPlanRow = ({index, status, dueDate, amount, principal, interest, rate}) => {
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
      <td>{rate}%</td>
    </tr>
  )
}