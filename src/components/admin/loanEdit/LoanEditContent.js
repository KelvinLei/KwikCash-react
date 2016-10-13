import React, { Component } from 'react'
import ContentWrapper from '../../../themeJsx/Layout/ContentWrapper';
import { Row, Col, Panel, Alert, ButtonGroup, Button, Table } from 'react-bootstrap';
import { Link } from 'react-router';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner'
import { FailureWidget } from '../../../components/shared/FailureWidget'
import { PAYMENT_SCHEDULE_MAPPING } from './PaymentScheduleMap'
import Calender from './Calendar'

require('pikaday/pikaday.js')
require('pikaday/plugins/pikaday.jquery.js')
require('pikaday/css/pikaday.css')

export default class LoanEditContent extends Component {

  componentDidMount() {
    Calender()
  }

  render() {
    const { loanLevelData } = this.props

    const loanEditOnClick = () => {
      // LoanEditWidget
      const loanStatus = $('input[name=loanStatusRadio]:checked').val()
      const repeatLoan = $('input[name=repeatLoanRadio]:checked').val()
      const paymentSchedule = $('#paymentScheduleSelect').val()
      const loanFundAmount = $('#input-loanFundAmount').val()
      const firstPaymentDate = $('#input-firstPaymentDate').val()
      const loanFundDate = $('#input-loanFundDate').val()
      const loanNoteDate = $('#input-loanNoteDate').val()
      const refiDate = $('#input-refiDate').val()
      const loanRate = $('#input-loanRate').val()
      const loanTerm = $('#input-loanTerm').val()

      // FundEditWidget
      const clientFundAmount = $('#inputClientFundAmount').val()
      const fundMethodRadio = $('input[name=fundMethodRadio]:checked').val()

      // MiscInfoWidget
      const isJudgement = $('input[name=judgementRadio]:checked').val()
      const defaultDate = $('#input-defaultDate').val()
      const lateDate = $('#input-lateDate').val()
      const manualDate = $('#input-manualDate').val()

      // RecoveryInfoWidget
      const isRecovery = $('input[name=recoveryRadio]:checked').val()
      const recoveryBalance = $('#input-recoveryBalance').val()
      const recoveryDate = $('#input-recoveryDate').val()
      const recoveryEndDate = $('#input-recoveryEndDate').val()


      console.log(`loanStatus ${loanStatus}`)
      console.log(`repeatLoan ${repeatLoan}`)
      console.log(`paymentSchedule ${paymentSchedule}`)
      console.log(`loanFundAmount ${loanFundAmount}`)
      console.log(`firstPaymentDate ${firstPaymentDate}`)
      console.log(`loanFundDate ${loanFundDate}`)
      console.log(`loanNoteDate ${loanNoteDate}`)
      console.log(`refiDate ${refiDate}`)
      console.log(`loanRate ${loanRate}`)
      console.log(`loanTerm ${loanTerm}`)

      console.log(`clientFundAmount ${clientFundAmount}`)
      console.log(`fundMethodRadio ${fundMethodRadio}`)

      console.log(`isJudgement ${isJudgement}`)
      console.log(`defaultDate ${defaultDate}`)
      console.log(`lateDate ${lateDate}`)
      console.log(`manualDate ${manualDate}`)

      console.log(`isRecovery ${isRecovery}`)
      console.log(`recoveryBalance ${recoveryBalance}`)
      console.log(`recoveryDate ${recoveryDate}`)
      console.log(`recoveryEndDate ${recoveryEndDate}`)

    }

    return (
      <ContentWrapper>
        <Row>
          <Col lg={ 6 }>
            <LoanEditWidget loanLevelData={loanLevelData}/>
          </Col>

          <Col lg={ 6 }>
            <FundEditWidget loanLevelData={loanLevelData}/>

            <MiscInfoWidget loanLevelData={loanLevelData}/>

            <RecoveryInfoWidget loanLevelData={loanLevelData}/>
          </Col>
        </Row>

        <Panel>
          <div className="panel-footer text-center">
            <button onClick={loanEditOnClick.bind(this)} className="btn btn-info" bsSize="large">Save Changes</button>
          </div>
        </Panel>
      </ContentWrapper>
    )
  }
}

const LoanEditWidget = ( {loanLevelData} ) => {

  const LOAN_STATUS_MAP = {
    A: 'Active',
    L: 'Late',
    M: 'Manual',
    P: 'Paid',
    D: 'ChargedOff',
    F: 'Plan'
  }

  const loanStatusRadioButtons = Object.keys(LOAN_STATUS_MAP).map( (statusCode, i) => {
    const defaultChecked = statusCode == loanLevelData.loanCode ? 'defaultChecked' : ''
    const id = "loanStatus-" + statusCode
    return (
      <Col lg={ 6 } key={i} >
        <label key={"label"+id} className="radio-inline c-radio">
          <input id={id} type="radio" defaultValue={statusCode} name="loanStatusRadio" defaultChecked={defaultChecked}/>
          <em className="fa fa-circle"/>{LOAN_STATUS_MAP[statusCode]}
        </label>
      </Col>
    )
  })

  const paymentScheduleDropdown = PAYMENT_SCHEDULE_MAPPING.map( (schedule, id) => {
    return (
      <option key={id} value={schedule.code}>
        {schedule.schedule}
      </option>
    )
  })

  const LOAN_INFO_REGULAR_INPUT = [
    { label: "Loan Amount", fieldName: "loanFundAmount"},
    { label: "First Payment Date", fieldName: "firstPaymentDate"},
    { label: "Loan Fund Date", fieldName: "loanFundDate"},
    { label: "Loan Note Date", fieldName: "loanNoteDate"},
    { label: "Refi Date", fieldName: "refiDate"},
    { label: "Loan Interest", fieldName: "loanRate"},
    { label: "Term (Periods)", fieldName: "loanTerm"},
  ]

  const loanInfoRegularInput = LOAN_INFO_REGULAR_INPUT.map( (input, i) => {
    const defaultValue = loanLevelData[input.fieldName]

    return (
      <fieldset key={i}>
        <div className="form-group">
          <label className="col-lg-4 control-label">{input.label}</label>
          <Col lg={ 8 }>
            <input type="text" id={"input-"+input.fieldName} defaultValue={defaultValue} className="form-control"/>
          </Col>
        </div>
      </fieldset>
    )
  })

  const isRepeatLoan = loanLevelData.isRepeatLoan == 'Y'

  return (
    <Panel header="Loan Info" className="panel-info">
      <form className="form-horizontal">
        <fieldset>
          <div className="form-group">
            <label className="col-lg-4 control-label">Loan Number</label>
            <Col lg={ 8 }>
              <div className="form-control-static"> {loanLevelData.loanNumber} </div>
            </Col>
          </div>
        </fieldset>

        <fieldset>
          <div className="form-group">
            <label className="col-lg-4 control-label">Member Name</label>
            <Col lg={ 8 }>
              <div className="form-control-static"> { loanLevelData.memberName }</div>
            </Col>
          </div>
        </fieldset>

        <fieldset>
          <div className="form-group">
            <label className="col-lg-4 control-label">Loan status</label>
            <Col lg={ 8 }>
              <Row>
                { loanStatusRadioButtons }
              </Row>
            </Col>
          </div>
        </fieldset>

        <fieldset>
          <div className="form-group">
            <label className="col-lg-4 control-label">Repeat Loan</label>
            <Col lg={ 8 }>
              <label className="radio-inline c-radio">
                <input id="repeatLoanYes" type="radio" defaultValue="Y" name="repeatLoanRadio" defaultChecked={isRepeatLoan ? 'defaultChecked' : ''}/>
                <em className="fa fa-circle"/>Yes
              </label>
              <label className="radio-inline c-radio">
                <input id="repeatLoanNo" type="radio" defaultValue="N" name="repeatLoanRadio" defaultChecked={!isRepeatLoan ? 'defaultChecked' : ''}/>
                <em className="fa fa-circle"/>No
              </label>
            </Col>
          </div>
        </fieldset>

        <fieldset>
          <div className="form-group">
            <label className="col-lg-4 control-label">Payment Schedule</label>
            <Col lg={ 8 }>
              <select id="paymentScheduleSelect" className="form-control">
                { paymentScheduleDropdown }
              </select>
            </Col>
          </div>
        </fieldset>

        { loanInfoRegularInput }
      </form>
    </Panel>
  )
}

const FundEditWidget = ( {loanLevelData} ) => {
  const FUND_METHOD = [
    'Unchanged',
    'None',
    "Wire-CashPro",
    "Credit(ACH)-CheckGateway",
  ]

  const loanStatusRadioButtons = FUND_METHOD.map( (method, i) => {
    const defaultChecked = i == 0 ? 'defaultChecked' : ''
    const id = "fundMethod-" + method
    return (
      <Col lg={12} key={i}>
        <label key={"label"+id} className="radio-inline c-radio">
          <input id={id} type="radio" defaultValue={method} name="fundMethodRadio" defaultChecked={defaultChecked}/>
          <em className="fa fa-circle"/>{method}
        </label>
      </Col>
    )
  })

  return (
    <Panel header="Funding Info" className="panel-primary">
      <form className="form-horizontal">
        <fieldset>
          <div className="form-group">
            <label className="col-lg-4 control-label">Client Fund Amount</label>
            <Col lg={ 8 }>
              <input type="text" id="inputClientFundAmount" defaultValue={loanLevelData.fundAmount} className="form-control"/>
            </Col>
          </div>
        </fieldset>

        <fieldset>
          <div className="form-group">
            <label className="col-lg-4 control-label">Client Fund Method</label>
            <Col lg={ 8 }>
              <Row>
                { loanStatusRadioButtons }
              </Row>
            </Col>
          </div>
        </fieldset>
      </form>
    </Panel>
  )
}

const MiscInfoWidget = ( {loanLevelData} ) => {
  const DATE_LIST = [
    { dateType: 'ChargeOff', fieldName: 'defaultDate'},
    { dateType: 'Late', fieldName: 'lateDate'},
    { dateType: 'Manual', fieldName: 'manualDate'},
  ]

  const dateInput = DATE_LIST.map( (date, i) => {
    const defaultValue = loanLevelData[date.fieldName]
    return (
      <fieldset key={i}>
        <div className="form-group">
          <label className="col-lg-4 control-label">{`${date.dateType} Date`}</label>
          <Col lg={ 8 }>
            <input type="text" id={`input-${date.fieldName}`} defaultValue={defaultValue} className="form-control"/>
          </Col>
        </div>
      </fieldset>
    )
  })

  const isJudgement = loanLevelData.judgement == 'Y'
  return (
    <Panel header="Misc Info" className="panel-danger">
      <form className="form-horizontal">
        <fieldset>
          <div className="form-group">
            <label className="col-lg-4 control-label">Judgement</label>
            <Col lg={ 8 }>
              <label className="radio-inline c-radio">
                <input id="judgementYes" type="radio" defaultValue="Y" name="judgementRadio" defaultChecked={isJudgement ? 'defaultChecked' : ''}/>
                <em className="fa fa-circle"/>Yes
              </label>
              <label className="radio-inline c-radio">
                <input id="judgementNo" type="radio" defaultValue="N" name="judgementRadio" defaultChecked={!isJudgement ? 'defaultChecked' : ''}/>
                <em className="fa fa-circle"/>No
              </label>
            </Col>
          </div>
        </fieldset>

        { dateInput }
      </form>
    </Panel>
  )
}

const RecoveryInfoWidget = ( {loanLevelData} ) => {
  const recoveryInput = [
    { dateType: 'Recovery Balance', fieldName: 'recoveryBalance'},
    { dateType: 'Recovery Start Date', fieldName: 'recoveryDate'},
    { dateType: 'Recovery End Date', fieldName: 'recoveryEndDate'},
  ]

  const recoveryInputFields = recoveryInput.map( (input, i) => {
    const defaultValue = loanLevelData[input.fieldName]
    return (
      <fieldset key={i}>
        <div className="form-group">
          <label className="col-lg-4 control-label">{input.dateType}</label>
          <Col lg={ 8 }>
            <input type="text" id={`input-${input.fieldName}`} defaultValue={defaultValue} className="form-control"/>
          </Col>
        </div>
      </fieldset>
    )
  })

  const isRecoveryIncome = loanLevelData.recovery == 'Y'
  return (
    <Panel header="Recovery Info" className="panel-success">
      <form className="form-horizontal">
        <fieldset>
          <div className="form-group">
            <label className="col-lg-4 control-label">Recovery Income</label>
            <Col lg={ 8 }>
              <label className="radio-inline c-radio">
                <input id="recoveryIncomeYes" type="radio" defaultValue="Y" name="recoveryRadio" defaultChecked={isRecoveryIncome ? 'defaultChecked' : ''}/>
                <em className="fa fa-circle"/>Yes
              </label>
              <label className="radio-inline c-radio">
                <input id="recoveryIncomeNo" type="radio" defaultValue="N" name="recoveryRadio" defaultChecked={!isRecoveryIncome ? 'defaultChecked' : ''}/>
                <em className="fa fa-circle"/>No
              </label>
            </Col>
          </div>
        </fieldset>

        { recoveryInputFields }
      </form>
    </Panel>
  )
}