import React, { Component } from 'react'
import ContentWrapper from '../../../themeJsx/Layout/ContentWrapper';
import { Row, Col } from 'react-bootstrap';

export default class LoanSummaryContent extends Component {
  render() {
    const {} = this.props;

    return (
      <ContentWrapper>
        <div className="content-heading">
          Hello John
          <small data-localize="dashboard.WELCOME">Loan ID: 1234</small>
        </div>
        <Row>
          <Col xs={12} className="text-center">
            <h2 className="text-thin">Loan Summary</h2>
            <Row>
              <h4>Current balance: $3000.00</h4>
            </Row>

            <Row>
              <h5>Next payment: June 12, 2016</h5>
            </Row>

            <Row>
              <button type="button" class="btn btn-info">Refinance</button>
            </Row>
          </Col>
        </Row>
      </ContentWrapper>
    )
  }
}
