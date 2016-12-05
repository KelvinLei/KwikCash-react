import React, { Component } from 'react'
import { Row, Col, Panel, Table, Grid, Button } from 'react-bootstrap';
import { Link } from 'react-router';
import DataTableScript from '../dataTable/DataTableScript'
import styles from '../dataTable/LoansDataTable.scss'

export default class LoanStatsDataTable extends Component {

  TABLE_DIV_ID = 'loanStatsDataTable'
  DEFAULT_SORTING = [0, 'desc', 1, 'desc']

  componentDidMount() {
    DataTableScript(this.TABLE_DIV_ID, this.DEFAULT_SORTING, 25, false, true)
  }

  render() {
    const { loanStats } = this.props;

    const loanStatsEntries = loanStats.map( (monthlyStats, i) => {
      return (
        <tr key={i} className="gradeX">
          <td>{ monthlyStats.year }</td>
          <td>{ monthlyStats.month }</td>
          <td>{ monthlyStats.loanCount }</td>
          <td>{ monthlyStats.loanAmount }</td>
          <td>{ monthlyStats.clientFunded }</td>
          {/*<td>{ monthlyStats.paymentCount }</td>*/}
          <td>{ monthlyStats.paymentAmount }</td>
          <td>{ monthlyStats.principal }</td>
          <td>{ monthlyStats.interest }</td>
          <td>{ monthlyStats.chargeOffCount }</td>
          <td>{ monthlyStats.chargeOffAmount }</td>
          <td>{ monthlyStats.recoveryCount }</td>
          <td>{ monthlyStats.recoveryAmount }</td>
          <td>{ monthlyStats.applicationCount }</td>
        </tr>
      )
    })

    return (
      <Grid fluid>
        <Row>
          <Col lg={ 12 }>
            <Panel header="Loan Monthly Stats Report" >
              <Table id={this.TABLE_DIV_ID} responsive striped hover>
                <thead>
                <tr>
                  <th>Year</th>
                  <th>Month</th>
                  <th>Loan Count</th>
                  <th>Loan Amount</th>
                  <th>Client Funded</th>
                  {/*<th>Payment Count</th>*/}
                  <th>Payments</th>
                  <th>Principal</th>
                  <th>Interest</th>
                  <th>ChargeOff Count</th>
                  <th>ChargeOff Amount</th>
                  <th>Recovery Count</th>
                  <th>Recovery Amount</th>
                  <th>Application Count</th>
                </tr>
                </thead>
                <tbody>
                  { loanStatsEntries }
                </tbody>
              </Table>
            </Panel>
          </Col>
        </Row>
      </Grid>
    )
  }
}