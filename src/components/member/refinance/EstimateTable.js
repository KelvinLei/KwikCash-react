import React from 'react'
import { Panel, Table } from 'react-bootstrap';

export const EstimateTable = ({currentBalance, refinanceValueForTable, newBalance}) => {
  return (
    <Panel header="Estimated new balance">
      <Table id="estimateTable" responsive striped hover>
        <thead>
        <tr>
          <th>Name</th>
          <th>Amount</th>
        </tr>
        </thead>

        <tbody>
        <tr>
          <td>Refinance amount:</td>
          <td>${refinanceValueForTable}</td>
        </tr>

        <tr>
          <td>Current balance:</td>
          <td>- ${currentBalance}</td>
        </tr>

        <tr className="warning">
          <td>Cash to be deposited:</td>
          <td>= ${newBalance}</td>
        </tr>
        </tbody>
      </Table>
    </Panel>
  )
}