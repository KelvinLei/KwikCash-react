import React, { Component } from 'react'
import ContentWrapper from '../../../themeJsx/Layout/ContentWrapper';
import { Row, Col, Panel, Button } from 'react-bootstrap';
import { Link } from 'react-router';
import ProgressChart from './progressChart';
import styles from './styles.scss'
import { PaymentPlanContent } from '../paymentInfo/PaymentPlanContent'
import {getClassNameForLoanStatus} from "../shared/LoanStyles";

export default class LoanSummaryContent extends Component {

  componentDidMount() {
    const { completePercentage, completePaymentsCount, pendingPaymentsCount } = this.props.paymentsProgressData
    ProgressChart(completePercentage, completePaymentsCount, pendingPaymentsCount);
  }

  componentWillReceiveProps(nextProps) {
    // once we have payments info available, rerender payments progress bar
    const { completePercentage, completePaymentsCount, pendingPaymentsCount } = nextProps.paymentsProgressData
    ProgressChart(completePercentage, completePaymentsCount, pendingPaymentsCount);
  }

  render() {
    const { loanData,
            paymentsData,
            paymentsProgressData,
            shouldDisplayRefinance,
            shouldDisplayPayoff,
            tabList,
            onClickPaymentTab,
            onClickPaymentYear } = this.props;

    return (
      <ContentWrapper>
        <div className="content-heading">
          Loan Summary
          <small data-localize="dashboard.WELCOME">Selected loan ID: {loanData.loanId}</small>
        </div>

        <LoanSummaryOverview loanData={loanData} shouldDisplayRefinance={shouldDisplayRefinance}/>

        <Row>
          <Col md={ 10 } mdOffset={1} >
            <PaymentPlanContent paymentsData={paymentsData}
                                tabList={tabList}
                                shouldDisplayPayoff={shouldDisplayPayoff}
                                onClickPaymentTab={onClickPaymentTab}
                                onClickPaymentYear={onClickPaymentYear}
            />
          </Col>
        </Row>

      </ContentWrapper>
    )
  }
}

const LoanSummaryOverview = ({loanData, shouldDisplayRefinance}) => {

  const styleClassName = getClassNameForLoanStatus(loanData.loanCode)

  const refinanceOption =
    shouldDisplayRefinance ?
    <div className="panel-footer text-left">
      <Link to={"/refinance/" + loanData.loanId} className="btn btn-info btn-sm">Refinance</Link>
    </div>
    :
    <div className="panel-footer text-left text-info">
      <span> {loanData.loanStatus} loan is not eligible for refinance </span>
    </div>

  return (
    <Row>
      <Col md={ 6 } className="text-left">
        <Panel className="panel-default" header="Payments progress">
          <div id="chartdiv"></div>
        </Panel>
      </Col>

      <Col md={ 6 }>
        <Panel className="panel-default" header="Overview">
          <div>
            <div className="list-group mb0">
              <div className="list-group-item">
                <span className={"pull-right " + styleClassName}>{loanData.loanStatus}</span>
                <div className="text-bold">Status:</div>
              </div>

              <div className="list-group-item">
                <span className="pull-right">${loanData.loanFundAmount}</span>
                <div className="text-bold">Fund amount:</div>
              </div>

              <div className="list-group-item">
                <span className="pull-right">{loanData.loanFundDate}</span>
                <div className="text-bold">Fund date:</div>
              </div>

              <div className="list-group-item">
                <span className="pull-right">{loanData.loanTerm}</span>
                <div className="text-bold">Term:</div>
              </div>

              <div className="list-group-item">
                <span className="pull-right">{loanData.loanRate}%</span>
                <div className="text-bold">APR:</div>
              </div>

              <div className="list-group-item">
                <span className="pull-right">${loanData.balance}</span>
                <div className="text-bold">Current balance:</div>
              </div>

              <div className="list-group-item">
                <span className="pull-right">{loanData.nextPaymentDate}</span>
                <div className="text-bold">Next payment:</div>
              </div>
            </div>

            { refinanceOption }
          </div>
        </Panel>
      </Col>
    </Row>
  )
}