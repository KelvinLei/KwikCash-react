import React, { Component } from 'react'
import ContentWrapper from '../../../themeJsx/Layout/ContentWrapper';
import { Row, Col, Panel, Button } from 'react-bootstrap';
import { Link } from 'react-router';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner'

export default class ExportLoansContent extends Component {

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  render() {
    const {} = this.props;

    return (
      <ContentWrapper>
        <div className="content-heading">
          Export Loans
        </div>

        <Row>
          <Col md={ 12 }>
            <Panel id="" className="panel-default" header="Filter Elements">
              <h4>Hello world</h4>
            </Panel>
          </Col>
        </Row>

      </ContentWrapper>
    )
  }
}
