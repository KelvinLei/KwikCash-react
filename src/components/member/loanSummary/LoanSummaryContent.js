import React, { Component } from 'react'
import ContentWrapper from '../../../themeJsx/Layout/ContentWrapper';
import { Row, Col, Panel, Button } from 'react-bootstrap';
import ProgressChart from './progressChart';
import styles from './styles.scss'
import { PaymentPlanContent } from '../paymentInfo/PaymentPlanContent'

export default class LoanSummaryContent extends Component {

  componentDidMount() {
    ProgressChart('25%');
  }

  render() {
    const { currentBalance, tabList, selectedPaymentStatus, paymentList, onClickPaymentTab } = this.props;

    return (
      <ContentWrapper>
        <div className="content-heading">
          Loan Summary
          <small data-localize="dashboard.WELCOME">Selected loan ID: 1234</small>
        </div>

        <LoanSummaryOverview currentBalance={currentBalance} />

        <Row>
          <Col md={ 8 } >
            <PaymentPlanContent tabList={tabList}
                                selectedPaymentStatus={selectedPaymentStatus}
                                paymentList={paymentList}
                                onClickPaymentTab={onClickPaymentTab} />
          </Col>
        </Row>

      </ContentWrapper>
    )
  }
}

const LoanSummaryOverview = ({currentBalance}) => (
  <Row>
    <Col md={ 6 } className="text-center">
      <Panel className="panel-default" header="Payment progress">
        <div id="chartdiv"></div>
      </Panel>
    </Col>

    <Col md={ 6 }>
      <Panel className="panel-default" header="Overview">
        <div>
          <div className="list-group mb0">
            <div className="list-group-item">
              <span className="pull-right">${currentBalance}</span>
              <div className="text-bold">Current balance:</div>
            </div>

            <div className="list-group-item">
              <span className="pull-right">4.0%</span>
              <div className="text-bold">APR:</div>
            </div>

            <div className="list-group-item">
              <span className="pull-right">June 12, 2016</span>
              <div className="text-bold">Next payment:</div>
            </div>
          </div>

          { /* END list group */ }
          <div className="panel-footer text-left">
            <a href="#" className="btn btn-info btn-sm">Refinance</a>
          </div>
        </div>
      </Panel>
    </Col>
  </Row>
);