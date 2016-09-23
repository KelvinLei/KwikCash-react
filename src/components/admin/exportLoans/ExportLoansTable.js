import React, { Component } from 'react'
import { Row, Col, Panel, Table, Grid, Button } from 'react-bootstrap';
import LoansDataTableScript from './LoansDataTableScript'
import styles from './LoansDataTable.scss'

require('pikaday/pikaday.js')
require('pikaday/plugins/pikaday.jquery.js')
require('pikaday/css/pikaday.css')

export default class ExportLoansTable extends Component {

  componentDidMount() {
    LoansDataTableScript()
  }

  render() {
    const { loans, filterContext } = this.props;

    const loanRow = loans.map( (loan, i) => {
      return (
        <tr key={i} className="gradeX">
          <td>{loan.loanNumber}</td>
          <td>{loan.loanStatus}</td>
          <td>{loan.firstName}</td>
          <td>{loan.lastName}</td>
          <td>${loan.loanFundAmount}</td>
          <td>{loan.loanRate}%</td>
          <td>{loan.loanNoteDate}</td>
          <td>{loan.loanFundDate}</td>
          { filterContext.balanceWanted && <td>${loan.balance}</td> }
          { filterContext.remainingPaymentsWanted && <td>{loan.remainingPayments}</td> }
          { filterContext.stateWanted && <td>{loan.state}</td> }
          { filterContext.payoffDateWanted && <td>{loan.payoffDate}</td> }
          { filterContext.defaultDateWanted && <td>{loan.defaultDate}</td> }
          { filterContext.emailWanted && <td>{loan.email}</td> }
          { filterContext.addressWanted && <td>{loan.address}</td> }
        </tr>
      )
    })

    return (
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
                  <th>Interest</th>
                  <th>NoteDate</th>
                  <th>FundDate</th>
                  { filterContext.balanceWanted && <th>Balance</th> }
                  { filterContext.remainingPaymentsWanted && <th>R.Payments</th> }
                  { filterContext.stateWanted && <th>State</th> }
                  { filterContext.payoffDateWanted && <th>PayoffDate</th> }
                  { filterContext.defaultDateWanted && <th>DefaultDate</th> }
                  { filterContext.emailWanted && <th>Email</th> }
                  { filterContext.addressWanted && <th>Full Addresses</th> }
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
    )
  }
}