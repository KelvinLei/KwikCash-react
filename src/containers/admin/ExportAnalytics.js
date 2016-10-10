import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import ContentWrapper from '../../themeJsx/Layout/ContentWrapper';
import { Row, Col, Panel, Table, Grid, Button } from 'react-bootstrap';
import ExportAnalyticsWidget from "../../components/admin/exportAnalytics/ExportAnalyticsWidget";

class ExportAnalytics extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
  }

  render() {
    return (
      <ContentWrapper>
        <div className="content-heading">
          Export Analytics
        </div>

        <Row>
          <Col md={ 12 }>
            <ExportAnalyticsWidget />
          </Col>
        </Row>

      </ContentWrapper>
    )
  }
}

ExportAnalytics.propTypes = {
}

const mapDispatchToProps = dispatch => {
  return {
  }
}

function mapStateToProps(state) {

  return {
  }
}

export default connect(
)(ExportAnalytics)
