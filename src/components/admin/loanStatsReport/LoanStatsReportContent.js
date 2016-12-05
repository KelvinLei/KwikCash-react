import React, { Component } from 'react'
import ContentWrapper from '../../../themeJsx/Layout/ContentWrapper';
import LoanStatsDataTable from './LoanStatsDataTable'
import { Row, Col, Panel, Button } from 'react-bootstrap';

export default class LoanStatsReportContent extends Component {

  DATE_RANGE_LIST = [
    { dateRange: 1, displayName: 'Last 1 year'},
    { dateRange: 3, displayName: 'Last 3 year'},
    { dateRange: 5, displayName: 'Last 5 year'},
    { dateRange: 8, displayName: 'Last 8 year'},
  ]

  render() {
    const { loanStats, fetchLoanStats } = this.props

    const dateRangeDropdown = this.DATE_RANGE_LIST.map( (dateRangeObj, id) => {
      return (
        <option key={id} value={dateRangeObj.dateRange} >
          { dateRangeObj.displayName }
        </option>
      )
    })

    const dateDropDownOnChange = (e) => {
      const dateRange = $('#dateRangeOption').val()
      fetchLoanStats(dateRange)
    }

    return (
      <ContentWrapper>
        <Row>
          <Col mdOffset={3} md={6}>
            <Panel header="Data Aggregation Date Range" className="panel-info">
              <Col mdOffset={2} md={8}>
                  <select id="dateRangeOption" onChange={dateDropDownOnChange.bind(this)} className="form-control">
                    { dateRangeDropdown }
                  </select>
              </Col>
            </Panel>
          </Col>
        </Row>

        <Row>
          <LoanStatsDataTable loanStats={loanStats}/>
        </Row>
      </ContentWrapper>
    )
  }
}
