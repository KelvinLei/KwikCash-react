import React, { Component } from 'react'
import ContentWrapper from '../../../themeJsx/Layout/ContentWrapper';
import { Row, Col, Panel, Alert, ButtonGroup, Button, Table } from 'react-bootstrap';
import { Link } from 'react-router';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner'
import { FailureWidget } from '../../../components/shared/FailureWidget'
import { PAYMENT_SCHEDULE_MAPPING, LOAN_STATUS_MAP } from '../../shared/constants'
import Calender from './Calendar'
var moment = require('moment')

require('pikaday/pikaday.js')
require('pikaday/plugins/pikaday.jquery.js')
require('pikaday/css/pikaday.css')

export default class LoanEditContent extends Component {

  componentDidMount() {
    Calender()
  }

  render() {
    const { loanLevelData, editLoanActionState, editLoanOnclick } = this.props

    const loanEditOnClick = () => {
      const loanId = loanLevelData.loanId
      const balance = loanLevelData.balance
      const currLoanStatus = loanLevelData.loanCode

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
      let fundMethod = loanLevelData.fundMethod
      if (fundMethodRadio == 'None') {
        fundMethod = ''
      }
      else if (fundMethodRadio != 'Unchanged') {
        fundMethod = fundMethodRadio
      }

      // MiscInfoWidget
      const isJudgement = $('input[name=judgementRadio]:checked').val()
      const payoffDate = loanStatus == 'P' && $('#input-payoffDate').val() == '' ?
        moment().format('YYYY-MM-DD') :
        $('#input-payoffDate').val()

      const defaultDate = loanStatus == 'D' && $('#input-defaultDate').val() == '' ?
        moment().format('YYYY-MM-DD') :
        $('#input-defaultDate').val()

      const lateDate = loanStatus == 'L' && $('#input-lateDate').val() == '' ?
        moment().format('YYYY-MM-DD') :
        $('#input-lateDate').val()

      const manualDate = loanStatus == 'M' && $('#input-manualDate').val() == '' ?
        moment().format('YYYY-MM-DD') :
        $('#input-manualDate').val()

      // RecoveryInfoWidget
      const isRecovery = $('input[name=recoveryRadio]:checked').val()
      const recoveryBalance = $('#input-recoveryBalance').val()
      const recoveryDate = $('#input-recoveryDate').val()
      const recoveryEndDate = $('#input-recoveryEndDate').val()

      editLoanOnclick({
        currLoanStatus,
        balance,
        loanId,
        loanStatus,
        repeatLoan,
        paymentSchedule,
        loanFundAmount,
        firstPaymentDate,
        loanFundDate,
        loanNoteDate,
        refiDate,
        loanRate,
        loanTerm,
        clientFundAmount,
        fundMethod,
        isJudgement,
        defaultDate,
        lateDate,
        payoffDate,
        manualDate,
        isRecovery,
        recoveryBalance,
        recoveryDate,
        recoveryEndDate,
      })
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
            {
              editLoanActionState.isFetching &&
              <div>Loading......</div>
            }
            {
              !editLoanActionState.isFetching && !editLoanActionState.isFailed &&
              <button onClick={loanEditOnClick.bind(this)} className="btn btn-info" bsSize="large">Save Changes</button>
            }
          </div>
        </Panel>

        <Row>
          <Col lg={ 12 } >
            {
              editLoanActionState.editSuccess &&
              <Alert bsStyle="success" className="text-center">
                <strong>Success - </strong> Loan has been updated!
              </Alert>
            }
            {
              editLoanActionState.isFailed &&
              <Alert bsStyle="danger" className="text-center">
                <strong>Error - </strong> Loan failed to get updated! Please refresh and try agian.
              </Alert>
            }
          </Col>
        </Row>
      </ContentWrapper>
    )
  }
}

const LoanEditWidget = ( {loanLevelData} ) => {

  const filterLoanStatus = ( status ) => {
    return status != 'F' // to change loan to Plan, use payment schedule change page 
  }

  const loanStatusRadioButtons =
    Object.keys(LOAN_STATUS_MAP).filter(filterLoanStatus).map( (statusCode, i) => {
      const defaultChecked = statusCode == loanLevelData.loanCode ? 'defaultChecked' : ''
      const id = "loanStatus-" + statusCode
      return (
        <Col lg={ 6 } key={i} >
          <label key={"label"+id} className="radio-inline c-radio">
            <input id={id} type="radio"
                   defaultValue={statusCode}
                   name="loanStatusRadio"
                   defaultChecked={defaultChecked}
            />
            <em className="fa fa-circle"/>{LOAN_STATUS_MAP[statusCode]}
          </label>
        </Col>
      )
    })

  const paymentScheduleDropdown = PAYMENT_SCHEDULE_MAPPING.map( (schedule, id) => {
    // const selected = schedule.code == loanLevelData.paymentScheduleCode ? 'selected' : ''
    return (
      <option key={id} value={schedule.code} >
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
              <span className="help-block m-b-none">A payoff payment will be auto-created when change to paid or chargedOff</span>
              <span className="help-block m-b-none">To change loans to plan, use paymentSchedule change page</span>
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
              <select id="paymentScheduleSelect" defaultValue={loanLevelData.paymentScheduleCode} className="form-control">
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
    { dateType: 'Payoff', fieldName: 'payoffDate'},
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
                <input id="judgementYes" type="radio" defaultValue="Y" name="judgementRadio"
                       defaultChecked={isJudgement ? 'defaultChecked' : ''}
                />
                <em className="fa fa-circle"/>Yes
              </label>
              <label className="radio-inline c-radio">
                <input id="judgementNo" type="radio" defaultValue="N" name="judgementRadio"
                       defaultChecked={!isJudgement ? 'defaultChecked' : ''}
                />
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
                <input id="recoveryIncomeYes" type="radio" defaultValue="Y" name="recoveryRadio"
                       defaultChecked={isRecoveryIncome ? 'defaultChecked' : ''}
                />
                <em className="fa fa-circle"/>Yes
              </label>
              <label className="radio-inline c-radio">
                <input id="recoveryIncomeNo" type="radio" defaultValue="N" name="recoveryRadio"
                       defaultChecked={!isRecoveryIncome ? 'defaultChecked' : ''}
                />
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