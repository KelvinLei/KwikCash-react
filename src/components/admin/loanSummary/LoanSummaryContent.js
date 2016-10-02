import React from 'react'
import ContentWrapper from '../../../themeJsx/Layout/ContentWrapper';
import { Row, Col, Panel, Alert, ButtonGroup, Button, Table } from 'react-bootstrap';
import { Link } from 'react-router';
import {PaymentTableAdmin} from "./PaymentTableAdmin";
import {getClassNameForLoanStatus} from "../../member/shared/LoanStyles";

require('pikaday/pikaday.js')
require('pikaday/plugins/pikaday.jquery.js')
require('pikaday/css/pikaday.css')

export const LoanSummaryContent = ({
  loanSummary,
}) => {

  return (
    <ContentWrapper>
      <Row>
        <Col md={ 6 } className="text-left">
          <Panel id="loanSummaryPanel" className="panel-default" header="Loan Info">
            <LoanSummaryTable loanLevelData={loanSummary.loanLevelData} />
          </Panel>
        </Col>

        <Col md={ 6 } className="text-left">
          <Panel id="memberProfilePanel" className="panel-default" header="Misc Info">
            <MiscInfoWidget loanLevelData={loanSummary.loanLevelData} />
          </Panel>
        </Col>
      </Row>

      <Row>
        <Col md={ 12 } >
          <PaymentTableAdmin paymentLevelData={loanSummary.paymentLevelData}/>
        </Col>
      </Row>
    </ContentWrapper>
  )
}

const MemberProfile = ( {loanLevelData} ) => {
  return (
    <div>
      <div>
        <div className="list-group mb0">
          <div className="list-group-item">
            <span className="pull-right">{loanLevelData.memberName}</span>
            <div className="text-bold">Name:</div>
          </div>

          <div className="list-group-item">
            <span className="pull-right">{loanLevelData.email}</span>
            <div className="text-bold">Email:</div>
          </div>

          <div className="list-group-item">
            <span className="pull-right">{loanLevelData.memberSsn}</span>
            <div className="text-bold">SSN:</div>
          </div>
        </div>

        <Button bsClass="btn btn-info">Edit</Button>
      </div>
    </div>
  )
}

const LoanSummaryTable = ({loanLevelData}) => {

  const styleClassName = getClassNameForLoanStatus(loanLevelData.loanCode)
  const loanEditUrl = '/admin/members/loanEdit/' + loanLevelData.loanId

  const isLoanPaidOff = loanLevelData.loanStatus == 'PAID'
  const isChargedOff = loanLevelData.loanCode == 'D'
  return (
    <div>
      <div className="list-group mb0">
        <div className="list-group-item">
          <span className={"pull-right " + styleClassName}>{loanLevelData.loanStatus}</span>
          <div className="text-bold">Status:</div>
        </div>

        <div className="list-group-item">
          <span className="pull-right">${loanLevelData.loanFundAmount}</span>
          <div className="text-bold">Loan amount:</div>
        </div>

        <div className="list-group-item">
          <span className="pull-right">${loanLevelData.fundAmount}</span>
          <div className="text-bold">Client fund amount:</div>
        </div>

        <div className="list-group-item">
          <span className="pull-right">{loanLevelData.loanTerm}</span>
          <div className="text-bold">Term:</div>
        </div>

        <div className="list-group-item">
          <span className="pull-right">{loanLevelData.loanRate}%</span>
          <div className="text-bold">APR:</div>
        </div>

        <div className="list-group-item">
          <span className="pull-right">${loanLevelData.balance}</span>
          <div className="text-bold">Current balance:</div>
        </div>

        <div className="list-group-item">
          <span className="pull-right">{loanLevelData.fundMethod}</span>
          <div className="text-bold">Fund method:</div>
        </div>

        <div className="list-group-item">
          <span className="pull-right">{loanLevelData.remainingPayments}</span>
          <div className="text-bold">Remaining payments:</div>
        </div>

        <div>
          <div className="list-group-item">
            <span className="pull-right">{loanLevelData.nextPaymentDate}</span>
            <div className="text-bold">Next payment:</div>
          </div>
        </div>

        <div className="panel-footer text-center">
          <Link to={loanEditUrl} >
            <button className="btn btn-oval btn-info" bsSize="large">Edit</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

const MiscInfoWidget = ( {loanLevelData} ) => {
  return (
    <div>
      <div className="list-group-item">
        <span className="pull-right">{loanLevelData.loanFundDate}</span>
        <div className="text-bold">Fund date:</div>
      </div>

      <div className="list-group-item">
        <span className="pull-right">{loanLevelData.loanNoteDate}</span>
        <div className="text-bold">Note date:</div>
      </div>
      <div className="list-group-item">
        <span className="pull-right">{loanLevelData.firstPaymentDate}</span>
        <div className="text-bold">First payment date:</div>
      </div>
      <div className="list-group-item">
        <span className="pull-right">{loanLevelData.defaultDate}</span>
        <div className="text-bold">ChargeOff date:</div>
      </div>
      <div className="list-group-item">
        <span className="pull-right">{loanLevelData.manualDate}</span>
        <div className="text-bold">Manual date:</div>
      </div>
      <div className="list-group-item">
        <span className="pull-right">{loanLevelData.lateDate}</span>
        <div className="text-bold">Late date:</div>
      </div>
      <div className="list-group-item">
        <span className="pull-right">{loanLevelData.recoveryDate}</span>
        <div className="text-bold">Recovery date:</div>
      </div>
      <div className="list-group-item">
        <span className="pull-right">{loanLevelData.recoveryEndDate}</span>
        <div className="text-bold">Recovery end date:</div>
      </div>
      <div className="list-group-item">
        <span className="pull-right">{loanLevelData.recoveryBalance}</span>
        <div className="text-bold">Recovery balance:</div>
      </div>
      <div className="list-group-item">
        <span className="pull-right">{loanLevelData.judgement}</span>
        <div className="text-bold">Judgement:</div>
      </div>
    </div>
  )
}

/*
 Renders error messagings
 */
const FailureWidget = () => (
  <Panel className="panel-default" header="Error">
    <Row>
      <Col md={ 12 }>
        Sorry, we failed to retrieve your data. Please try again or contact us.
      </Col>
    </Row>
  </Panel>
)