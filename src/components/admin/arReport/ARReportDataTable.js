import React, { Component } from 'react'
import { Row, Col, Panel, Table, Grid, Button } from 'react-bootstrap';
import { Link } from 'react-router';
import DataTableScript from '../dataTable/DataTableScript'
import styles from '../dataTable/LoansDataTable.scss'

export default class ARReportDataTable extends Component {

  TABLE_DIV_ID = 'arReportDataTable'
  // DEFAULT_SORTING = [0, 'desc', 1, 'desc']

  componentDidMount() {
    DataTableScript(this.TABLE_DIV_ID, [], 25, false, true)
  }

  render() {
    const { loans } = this.props;

    const loanEntries = loans.map( (loan, i) => {
      return (
        <tr key={i} >
          <td>{ loan.fullName }</td>
          <td>{ loan.id }</td>
          <td>{ loan.loanNumber }</td>
          <td>{ loan.loanFundDate }</td>
          <td>{ loan.loanNoteDate }</td>
          <td>{ loan.loanStatus }</td>
          <td>{ loan.loanBalance }</td>
          <td>{ loan.lastPaymentDate }</td>
          <td>{ loan.nextPaymentDate }</td>
          <td>${ loan.balance_00 }</td>
          <td>${ loan.balance_31 }</td>
          <td>${ loan.balance_61 }</td>
          <td>${ loan.balance_91 }</td>
          <td>${ loan.balance_121 }</td>
          <td>${ loan.balance_151 }</td>
          <td>{ loan.daysLate }</td>
        </tr>
      )
    })

    return (
      <Grid fluid>
        <Row>
          <Col lg={ 12 }>
            <Panel header="A/R Report" className="panel-info">
              <Table id={this.TABLE_DIV_ID} responsive striped hover>
                <thead>
                <tr>
                  <th>Name</th>
                  <th>App</th>
                  <th>Loan</th>
                  <th>FundDate</th>
                  <th>IntDate</th>
                  <th>Status</th>
                  <th>Balance</th>
                  <th>Last PayDate</th>
                  <th>Next PayDate</th>
                  <th>0-30</th>
                  <th>31-60</th>
                  <th>61-90</th>
                  <th>91-120</th>
                  <th>121-150</th>
                  <th>151-180</th>
                  <th>Days Late</th>
                </tr>
                </thead>
                <tbody>
                { loanEntries }
                </tbody>
              </Table>
            </Panel>
          </Col>
        </Row>
      </Grid>
    )
  }
}