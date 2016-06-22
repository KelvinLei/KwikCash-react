import React, { Component } from 'react'
import { Panel, Table } from 'react-bootstrap';

export default class EstimateTable extends Component {
  render() {
    const { currentBalance, refinanceValue, newBalance } = this.props;

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
              <td>${refinanceValue}</td>
            </tr>

            <tr>
              <td>Current balance:</td>
              <td>- ${currentBalance}</td>
            </tr>

            <tr className="warning">
              <td>Estimated new balance:</td>
              <td>= ${newBalance}</td>
            </tr>
          </tbody>
        </Table>
      </Panel>
    )
  }
}