import React, { Component } from 'react'
import ContentWrapper from '../../../themeJsx/Layout/ContentWrapper';
import { Row, Col, Panel, Button } from 'react-bootstrap';
import { Link } from 'react-router';
import ProgressChart from './progressChart';
import styles from './styles.scss'
import { PaymentPlanContent } from '../paymentInfo/PaymentPlanContent'
import {getClassNameForLoanStatus} from "../shared/LoanStyles";
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner'
import {sendCounterMetrics, METRICS_NAME_REAPPLY_BTN_COUNT} from "../../../api/index";

export default class LoanSummaryContent extends Component {

  componentDidMount() {
    const { completePercentage, amountPaid, amountRemaining } = this.props.paymentsProgressData
    ProgressChart(completePercentage, amountPaid, amountRemaining);
  }

  componentWillReceiveProps(nextProps) {
    // once we have payments info available, rerender payments progress bar if data is different
    const { completePercentage, amountPaid, amountRemaining } = nextProps.paymentsProgressData
    if (completePercentage !== this.props.paymentsProgressData.completePercentage) {
      ProgressChart(completePercentage, amountPaid, amountRemaining);
    }
  }

  render() {
    const { loanData,
      paymentsData,
      paymentsProgressData,
      customerName,
      shouldDisplayRefinance,
      shouldDisplayPayoff,
      canReapply,
      tabList,
      onClickPaymentTab,
      onClickPaymentYear,
      onClickPayoff } = this.props;

    return (
      <ContentWrapper>
        <div className="content-heading">
          Loan Summary
          <small data-localize="dashboard.WELCOME">Selected loan ID: { loanData && loanData.loanNumber}</small>
        </div>

        <Row>
          <Col md={ 6 } className="text-left">
            <Panel id="loan-progress-panel" className="panel-default" header="Loan progress">
              <canvas height="365px" id="chartjs-doughnutchart"></canvas>
            </Panel>
          </Col>

          <Col id="loan-data-col" md={ 6 }>
            {
              loanData
                ? <LoanSummaryOverview loanData={loanData}
                                       shouldDisplayRefinance={shouldDisplayRefinance}
                                       canReapply={canReapply}/>
                : <LoadingSpinner/>
            }
          </Col>
        </Row>

        <Row>
          <Col md={ 12 } >
            <PaymentPlanContent paymentsData={paymentsData}
                                customerName={customerName}
                                tabList={tabList}
                                shouldDisplayPayoff={shouldDisplayPayoff}
                                onClickPaymentTab={onClickPaymentTab}
                                onClickPaymentYear={onClickPaymentYear}
                                onClickPayoff={onClickPayoff}
            />
          </Col>
        </Row>

      </ContentWrapper>
    )
  }
}

const LoanSummaryOverview = ({loanData, shouldDisplayRefinance, canReapply}) => {

  const reapplyOnClick = (e) => {
    sendCounterMetrics(METRICS_NAME_REAPPLY_BTN_COUNT, [])
  }

  const styleClassName = getClassNameForLoanStatus(loanData.loanCode)

  const isLoanPaidOff = loanData.loanStatus == 'PAID'

  const refinanceOption =
    shouldDisplayRefinance &&
    <div className="text-left">
      <Link to={"/myLoans/refinance/" + loanData.loanId} className="btn btn-info btn-sm">Refinance</Link>
    </div>

  const reapplyOption =
    canReapply &&
    <a href="https://www.kwikcashonline.com/members/memberReApply.php" onClick={reapplyOnClick.bind(this)} className="btn btn-info btn-sm">
      Re-apply
    </a>

  return (
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

          {
            !isLoanPaidOff &&
            <div>
              <div className="list-group-item">
                <span className="pull-right">{loanData.paymentSchedule}</span>
                <div className="text-bold">Payment schedule:</div>
              </div>

              <div className="list-group-item">
                <span className="pull-right">{loanData.nextPaymentDate}</span>
                <div className="text-bold">Next payment:</div>
              </div>
            </div>
          }
        </div>

        <div className="panel-footer ">
          <span className="pull-right">
            { refinanceOption }
          </span>
          <div className="text-bold">
            { reapplyOption }
          </div>
        </div>
      </div>
    </Panel>
  )
}
