import React, { Component } from 'react'
import { Row, Col, Panel, Table, Grid, Button } from 'react-bootstrap';
import { exportARReport } from '../../../api/adminApiClient'
import downloadjs from 'downloadjs'

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const exportOnClick = () => {
  exportARReport().then(response => {
    downloadjs(response, "exportARReport.xlsx", "application/vnd.ms-excel")
  }).catch(() => {
    console.log("exportARReport failed")
  })
}

export const ARReportContent = ({
  stats
}) => {

  return (
    <div>
      <Row>
        <Col mdOffset={3} md={6}>
          <ARReportCounts stats={stats}/>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <ARReportSummary stats={stats} />
        </Col>
      </Row>
    </div>
  )
}

const ARReportCounts = ({
  stats
}) => {
  return (
    <Panel header="A/R Counts" className="panel-info">
      <Table id="paymentPlantTable" responsive striped hover>
        <thead>
        <tr>
          <th/>
          <th>Count</th>
          <th>Percent</th>
          <th>Average Rate</th>
          <th>Total Late</th>
          <th>Percent</th>
        </tr>
        </thead>

        <tbody>
        <tr>
          <td>Active</td>
          <td>{ numberWithCommas(stats.total_countactive) }</td>
          <td>{ stats.percent_active}%</td>
          <td>{ stats.average_rateactive}%</td>
          <td>${ numberWithCommas(stats.total_amountactive) }</td>
          <td>{ stats.percent_activeamount}%</td>
        </tr>
        <tr>
          <td>Late</td>
          <td>{ numberWithCommas(stats.total_countlate) }</td>
          <td>{ stats.percent_late}%</td>
          <td>{ stats.average_ratelate}%</td>
          <td>${ numberWithCommas(stats.total_total) }</td>
          <td>{stats.percent_lateamount}%</td>
        </tr>
        <tr>
          <td>Total</td>
          <td>{ numberWithCommas(stats.total_count) }</td>
          <td/>
          <td/>
          <td/>
          <td/>
        </tr>
        </tbody>
      </Table>

      <div className="panel-footer text-center">
        <Button onClick={exportOnClick} bsClass="btn btn-oval btn-info" className="mb-sm">Export</Button>
      </div>
    </Panel>
  )
}

const ARReportSummary = ({
  stats
}) => {
  return (
    <Panel header="A/R Report Summary" className="panel-info">
      <Table id="paymentPlantTable" responsive striped hover>
        <thead>
        <tr>
          <th/>
          <th>Balance</th>
          <th>Last Amount</th>
          <th>0-30</th>
          <th>31-60</th>
          <th>61-90</th>
          <th>91-120</th>
          <th>121-150</th>
          <th>151-180</th>
        </tr>
        </thead>

        <tbody>
        <tr>
          <td>Total</td>
          <td>${ numberWithCommas(stats.total_balance) }</td>
          <td>${ numberWithCommas(stats.total_lastpayment) }</td>
          <td>${ numberWithCommas(stats.total_00) }</td>
          <td>${ numberWithCommas(stats.total_31) }</td>
          <td>${ numberWithCommas(stats.total_61) }</td>
          <td>${ numberWithCommas(stats.total_91) }</td>
          <td>${ numberWithCommas(stats.total_121) }</td>
          <td>${ numberWithCommas(stats.total_151) }</td>
        </tr>
        <tr>
          <td>Count</td>
          <td/>
          <td/>
          <td>{ stats.count_00 }</td>
          <td>{ stats.count_31 }</td>
          <td>{ stats.count_61 }</td>
          <td>{ stats.count_91 }</td>
          <td>{ stats.count_121 }</td>
          <td>{ stats.count_151 }</td>
        </tr>
        </tbody>
      </Table>
    </Panel>
  )
}