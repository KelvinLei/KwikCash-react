import React, { Component } from 'react'
import ContentWrapper from '../../../themeJsx/Layout/ContentWrapper';
import { Row, Col, Panel, Button } from 'react-bootstrap';
import { Link } from 'react-router';
import ProgressChart from './progressChart';
import PopoverRun from '../loanSelection/PopoverRun'
import popoverStyles from '../loanSelection/popoverStyles.scss'
import styles from './styles.scss'
import { PaymentPlanContent } from '../paymentInfo/PaymentPlanContent'
import {getClassNameForLoanStatus} from "../shared/LoanStyles";
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner'

require('bootstrap')

export default class LoanSummaryContent extends Component {

  componentDidMount() {
    const { completePercentage, amountPaid, amountRemaining } = this.props.paymentsProgressData
    ProgressChart(completePercentage, amountPaid, amountRemaining);
    PopoverRun()
  }

  componentWillReceiveProps(nextProps) {
    // once we have payments info available, rerender payments progress bar if data is different
    const { completePercentage, amountPaid, amountRemaining } = nextProps.paymentsProgressData
    if (completePercentage !== this.props.paymentsProgressData.completePercentage) {
      ProgressChart(completePercentage, amountPaid, amountRemaining);
    }
    PopoverRun()
  }

  render() {
    const { loanData,
      paymentsData,
      paymentsProgressData,
      customerName,
      shouldDisplayRefinance,
      shouldDisplayPayoff,
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
              <canvas width="300px" height="300px" id="chartjs-doughnutchart"></canvas>
            </Panel>
          </Col>

          <Col id="loan-data-col" md={ 6 }>
            {
              loanData
                ? <LoanSummaryOverview loanData={loanData}
                                       shouldDisplayRefinance={shouldDisplayRefinance}/>
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

class LoanSummaryOverview  extends React.Component {

  render() {
    const {loanData, shouldDisplayRefinance} = this.props

    const styleClassName = getClassNameForLoanStatus(loanData.loanCode)

    const isLoanPaidOff = loanData.loanStatus == 'PAID'

    const refinanceOption =
      shouldDisplayRefinance &&
      <div className="panel-footer">
        <div className="text-bold">
          <div className="text-left">
            <Link to="/myLoans/reapply">
              <Button bsClass="btn btn-labeled btn-success mr"
                      data-toggle="refiPopover"
                      title="Congratulations"
                      data-content="You are eligible for a new loan!"
                      bsSize="large"
                      className="mb-sm">
                <span className="btn-label"><i className="fa fa-check"/></span> Refinance
              </Button>
            </Link>
          </div>
        </div>
      </div>

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
                  <span className="pull-right">{loanData.nextPaymentDate}</span>
                  <div className="text-bold">Next payment:</div>
                </div>
              </div>
            }
          </div>

          { refinanceOption }
        </div>
      </Panel>
    )
  }
}
