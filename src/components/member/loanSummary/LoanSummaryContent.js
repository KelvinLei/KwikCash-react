import React, { Component } from 'react'
import ContentWrapper from '../../../themeJsx/Layout/ContentWrapper';
import { Row, Col, Panel } from 'react-bootstrap';
import ProgressChart from './progressChart';
import styles from './styles.scss'

export default class LoanSummaryContent extends Component {

  componentDidMount() {
    ProgressChart('25%');
  }

  render() {
    const { currentBalance } = this.props;

    return (
      <ContentWrapper>
        <div className="content-heading">
          Hello John
          <small data-localize="dashboard.WELCOME">Selected loan ID: 1234</small>
        </div>
        <Row>
          <Col md={12} className="text-center">
            <h2 className="text-thin">Loan Summary</h2>
          </Col>
        </Row>

        <Row>
          <Col md={ 6 } className="text-center">
            <Panel header="Payments progress">
              <div id="chartdiv"></div>
            </Panel>
          </Col>

          <Col md={ 6 } className="text-center">
            <Panel header="Overview">
              <Row>
                <Col md={12}>
                  <h4>Current balance: ${currentBalance}</h4>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                <h5>Next payment: June 12, 2016</h5>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                <button type="button" class="btn btn-info">Refinance</button>
                </Col>
              </Row>
            </Panel>
          </Col>

        </Row>
      </ContentWrapper>
    )
  }
}
