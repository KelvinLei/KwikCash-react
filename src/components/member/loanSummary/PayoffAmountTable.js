import React from 'react'
import { Table } from 'react-bootstrap'

export const PayoffAmountTable = ({
  payoffData
}) => {
  const payoffAmountList = payoffData.payoffAmountList

  const payoffAmountListContent = payoffAmountList.map((payoff, index) => {
    const { payoffDate, payoffAmount } = payoff

    return (
      <tr>
        <td>{index}</td>
        <td>{payoffDate}</td>
        <td>{'$' + payoffAmount}</td>
      </tr>
    )
  })

  return (
    <Table id="paymentPlantTable" responsive striped hover>
      <thead>
      <tr>
        <th className="sort-numeric">#</th>
        <th className="sort-numeric">Payoff Date</th>
        <th className="sort-numeric">Payoff Amount</th>
      </tr>
      </thead>

      <tbody>
      { payoffAmountListContent }
      </tbody>
    </Table>
  )
}
