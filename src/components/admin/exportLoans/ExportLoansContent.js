import React, { Component } from 'react'
import ContentWrapper from '../../../themeJsx/Layout/ContentWrapper';
import { Row, Col, Panel, Table, Grid, Button } from 'react-bootstrap';
import LoansDataTableScript from './LoansDataTableScript'
import Calender from './Calendar'
import { LoanFilterWidget } from './LoanFilterWidget'
import styles from './LoansDataTable.scss'

require('pikaday/pikaday.js')
require('pikaday/plugins/pikaday.jquery.js')
require('pikaday/css/pikaday.css')

export default class ExportLoansContent extends Component {

  componentDidMount() {
    LoansDataTableScript()
    Calender()
  }

  render() {
    const { loans } = this.props;

    const loanRow = loans.map( (loan) => {
      return (
        <tr key={loan.loanNumber} className="gradeX">
          <td>{loan.loanNumber}</td>
          <td>{loan.loanStatus}</td>
          <td>{loan.firstName}</td>
          <td>{loan.lastName}</td>
          <td>${loan.loanFundAmount}</td>
          <td>${loan.balance}</td>
          <td>{loan.remainingPayments}</td>
          <td>{loan.loanRate}%</td>
          <td>{loan.state}</td>
          <td>{loan.loanNoteDate}</td>
          <td>{loan.loanFundDate}</td>
        </tr>
      )
    })

    return (
      <ContentWrapper>
        <div className="content-heading">
          Export Loans
        </div>

        <Row>
          <Col md={ 12 }>
            <LoanFilterWidget />
          </Col>
        </Row>

        <Grid fluid>
          <Row>
            <Col lg={ 12 }>
              <Panel header={"Loan Data Table - Total matched rows: " + loans.length}>
                <Table id="datatable1" responsive striped hover>
                  <thead>
                  <tr>
                    <th>LoanID</th>
                    <th>Status</th>
                    <th>FirstName</th>
                    <th>LastName</th>
                    <th>LoanAmount</th>
                    <th>Balance</th>
                    <th>PaymentsLeft</th>
                    <th>Interest</th>
                    <th>State</th>
                    <th>NoteDate</th>
                    <th>FundDate</th>
                  </tr>
                  </thead>
                  <tbody>
                  { loanRow }
                  </tbody>
                </Table>
              </Panel>
            </Col>
          </Row>
        </Grid>

      </ContentWrapper>
    )
  }
}