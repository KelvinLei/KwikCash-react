import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import ContentWrapper from '../../themeJsx/Layout/ContentWrapper';
import ARReportDataTable from '../../components/admin/arReport/ARReportDataTable'
import { ARReportContent } from '../../components/admin/arReport/ARReportContent'
import { LoadingSpinner } from '../../components/shared/LoadingSpinner'
import { FailureWidget } from '../../components/shared/FailureWidget'
import { Row, Col, Panel, Button } from 'react-bootstrap';
import {fetchARReportAction} from "../../redux/actions/admin/fetchARReport";

class ARReport extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { fetchARReport } = this.props
    fetchARReport()
  }

  render() {
    const { arReportState } = this.props
    const { isFetching, isFailed, arReport } = arReportState

    let arReportTableDisplay, statsDisplay
    if (isFetching) {
      arReportTableDisplay = <LoadingSpinner/>
      statsDisplay = <LoadingSpinner/>
    }
    else if (isFailed) {
      arReportTableDisplay = <FailureWidget/>
      statsDisplay = <FailureWidget/>
    }
    else {
      arReportTableDisplay = <ARReportDataTable loans={arReport.applications} />
      statsDisplay = <ARReportContent stats={arReport.stats}/>
    }

    return (
      <ContentWrapper>
        { statsDisplay }

        <Row>
          { arReportTableDisplay }
        </Row>
      </ContentWrapper>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchARReport: () => dispatch(fetchARReportAction()),
  }
}

function mapStateToProps(state) {
  const { arReportState } = state

  return {
    arReportState,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ARReport)
