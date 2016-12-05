import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import ContentWrapper from '../../themeJsx/Layout/ContentWrapper';
import LoanStatsReportContent from '../../components/admin/loanStatsReport/LoanStatsReportContent'
import LoanStatsDataTable from '../../components/admin/loanStatsReport/LoanStatsDataTable'
import {fetchLoanStatsAction} from "../../redux/actions/admin/fetchLoanStats"
import { LoadingSpinner } from '../../components/shared/LoadingSpinner'
import { FailureWidget } from '../../components/shared/FailureWidget'
import { Row, Col, Panel, Button } from 'react-bootstrap';
import {editLoanAction, resetEditLoanAlertAction} from "../../redux/actions/admin/editLoan";

class LoanStatsReport extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { fetchLoanStats } = this.props
    fetchLoanStats(1)
  }

  DATE_RANGE_LIST = [
    { dateRange: 1, displayName: 'Last 1 year'},
    { dateRange: 3, displayName: 'Last 3 year'},
    { dateRange: 5, displayName: 'Last 5 year'},
    { dateRange: 8, displayName: 'Last 8 year'},
  ]

  render() {
    const { loanStatsDataState, fetchLoanStats } = this.props
    const { isFetching, isFetchFailed, loanStats } = loanStatsDataState

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

    let loanStatsTableDisplay
    if (isFetching) {
      loanStatsTableDisplay = <LoadingSpinner/>
    }
    else if (isFetchFailed) {
      loanStatsTableDisplay = <FailureWidget/>
    }
    else {
      loanStatsTableDisplay = <LoanStatsDataTable loanStats={loanStats} />
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
          { loanStatsTableDisplay }
        </Row>
      </ContentWrapper>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchLoanStats: (dateRange) => dispatch(fetchLoanStatsAction(dateRange)),
  }
}

function mapStateToProps(state) {
  const { loanStatsDataState } = state

  return {
    loanStatsDataState,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoanStatsReport)
