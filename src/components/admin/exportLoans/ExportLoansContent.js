import React, { Component } from 'react'
import ContentWrapper from '../../../themeJsx/Layout/ContentWrapper';
import { Row, Col, Panel, Table, Grid, Button } from 'react-bootstrap';
import { Link } from 'react-router';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner'
import LoansDataTableScript from './LoansDataTableScript'
import Calender from './Calendar'
import { LoanFilterWidget } from './LoanFilterWidget'
import { LoanDataTable } from './LoanDataTable'
import styles from './LoansDataTable.scss'

require('pikaday/pikaday.js')
require('pikaday/plugins/pikaday.jquery.js')
require('pikaday/css/pikaday.css')

export default class ExportLoansContent extends Component {

  componentDidMount() {
    LoansDataTableScript()
    Calender()
  }

  // componentWillReceiveProps() {
  //   LoansDataTableScript()
  // }

  render() {
    const { isFetching, fetchLoansFailed, loans } = this.props;

    // display different components based on the status of getLoanList api call
    let dataTableContent
    if (isFetching) {
      dataTableContent = <LoadingSpinner/>
    }
    else if (fetchLoansFailed) {
      dataTableContent = <FailureWidget/>
    }
    else {
      dataTableContent = <LoanDataTable loans={loans}/>
    }

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
              <Panel header="Data Tables | Zero Configuration">
                <Table id="datatable1" responsive striped hover>
                  <thead>
                  <tr>
                    <th>Loan ID</th>
                    <th className="sort-alpha">Status</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th className="sort-numeric">Loan Amount</th>
                    <th className="sort-numeric">Interest</th>
                    <th>Note Date</th>
                    <th>Fund Date</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr className="gradeX">
                    <td>Trident</td>
                    <td>Internet Explorer 4.0</td>
                    <td>Win 95+</td>
                    <td>4</td>
                    <td>X</td>
                  </tr>
                  <tr className="gradeC">
                    <td>Trident</td>
                    <td>Internet Explorer 5.0</td>
                    <td>Win 95+</td>
                    <td>5</td>
                    <td>C</td>
                  </tr>
                  <tr className="gradeA">
                    <td>Trident</td>
                    <td>Internet Explorer 5.5</td>
                    <td>Win 95+</td>
                    <td>5.5</td>
                    <td>A</td>
                  </tr>
                  <tr className="gradeA">
                    <td>Trident</td>
                    <td>Internet Explorer 6</td>
                    <td>Win 98+</td>
                    <td>6</td>
                    <td>A</td>
                  </tr>
                  <tr className="gradeA">
                    <td>Trident</td>
                    <td>Internet Explorer 7</td>
                    <td>Win XP SP2+</td>
                    <td>7</td>
                    <td>A</td>
                  </tr>
                  <tr className="gradeA">
                    <td>Trident</td>
                    <td>AOL browser (AOL desktop)</td>
                    <td>Win XP</td>
                    <td>6</td>
                    <td>A</td>
                  </tr>
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

