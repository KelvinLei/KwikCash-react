import React, { Component } from 'react'
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner'
import { Row, Col, Panel, Button } from 'react-bootstrap';
import { exportRepeats } from '../../../api/adminApiClient'
import downloadjs from 'downloadjs'

const exportRepeatLoans = () => {
  exportRepeats().then(response => {
    downloadjs(response, "repeatLoans.xlsx", "application/vnd.ms-excel")
  }).catch(() => {
    console.log("repeat loan failed")
  })
}

export default class LoanFilterWidget extends Component {

  render() {
    return (
      <Panel header="Analytics Filtering">
        <a onClick={exportRepeatLoans}>Export Repeat Loan Clients</a>
      </Panel>
    )
  }
}
