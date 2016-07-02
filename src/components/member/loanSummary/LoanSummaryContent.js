import React, { Component } from 'react'
import ContentWrapper from '../../../themeJsx/Layout/ContentWrapper';
import { Row, Col, Panel, Button } from 'react-bootstrap';
import { Link } from 'react-router';
import ProgressChart from './progressChart';
import styles from './styles.scss'
import { PaymentPlanContent } from '../paymentInfo/PaymentPlanContent'

export default class LoanSummaryContent extends Component {

  componentDidMount() {
    ProgressChart('25%');
  }

  render() {
    const { loanId, currentBalance, tabList, selectedPaymentStatus, paymentList, onClickPaymentTab } = this.props;

    return (
      <ContentWrapper>
        <div className="content-heading">
          Loan Summary
          <small data-localize="dashboard.WELCOME">Selected loan ID: {loanId}</small>
        </div>

        <LoanSummaryOverview loanId={loanId} currentBalance={currentBalance} />

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

const LoanSummaryOverview = ({loanId, currentBalance}) => (
  <Row>
    <Col md={ 6 } className="text-left">
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
            <Link to={"/refinance/" + loanId} className="btn btn-info btn-sm">Refinance</Link>
          </div>
        </div>
      </Panel>
    </Col>
  </Row>
);