import React, { Component } from 'react'
import states from './states_info'
import Calender from './Calendar'
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner'
import { Row, Col, Panel, Button } from 'react-bootstrap';

export default class LoanFilterWidget extends Component {

  componentDidMount() {
    Calender()
  }

  LOAN_STATUS_MAP = {
    ALL: 'All',
    A: 'Active',
    L: 'Late',
    M: 'Manual',
    P: 'Paid',
    D: 'Charged off',
    F: 'Plan'
  }

  CONFIGURABLE_COLUMNS = [
    'Address', 'Email', 'State', 'RemainingPayments', 'Balance',
    'DefaultDate', 'PayoffDate', 'RecoveryDate', 'RecoveryBalance',
    'Judgement'
  ]

  render() {
    const { isExportLoansFetching, exportLoansFailed, filterLoans, exportLoans } = this.props

    const configurableColumnsCheckbox = this.CONFIGURABLE_COLUMNS.map( (column, i) => {
      return (
        <Col sm={ 5 } key={i} >
          <div className="checkbox c-checkbox needsclick">
            <label className="needsclick">
              <input id={'checkbox' + column} type="checkbox" className="needsclick"/>
              <em className="fa fa-check"/>{column}
            </label>
          </div>
        </Col>
      )
    })

    const statesDropdown = states.map( (state, id) => {
      return (
        <option key={id} defaultValue={state.abbreviation}>
          {state.abbreviation} - {state.name}
        </option>
      )
    })

    const loanStatusRadioButtons = Object.keys(this.LOAN_STATUS_MAP).map( (statusCode, i) => {
      const defaultChecked = i == 0 ? 'defaultChecked' : ''
      const id = "loanStatus-" + statusCode
      return (
        <label key={"label"+id} className="radio-inline c-radio">
          <input id={id} type="radio" defaultValue={statusCode} name="loanStatusRadio" defaultChecked={defaultChecked}/>
          <em className="fa fa-circle"/>{this.LOAN_STATUS_MAP[statusCode]}
        </label>
      )
    })

    const getFilters = () => {
      const fundStartDate = $('#fundStartDate').val()
      const fundEndDate = $('#fundEndDate').val()
      const payoffStartDate = $('#payoffStartDate').val()
      const payoffEndDate = $('#payoffEndDate').val()
      const loanStatus = $('input[name=loanStatusRadio]:checked').val()
      const state = $('#stateOption').val().split('-')[0].trim()

      // checkbox
      const recoveryLoans = $('#checkboxRecoveryLoans').is(":checked")
      const recoveryBalanceWanted = $('#checkboxRecoveryBalance').is(":checked")
      const recoveryDateWanted = $('#checkboxRecoveryDate').is(":checked")
      const judgementWanted = $('#checkboxJudgement').is(":checked")
      const addressWanted = $('#checkboxAddress').is(":checked")
      const emailWanted = $('#checkboxEmail').is(":checked")
      const stateWanted = $('#checkboxState').is(":checked")
      const remainingPaymentsWanted = $('#checkboxRemainingPayments').is(":checked")
      const balanceWanted = $('#checkboxBalance').is(":checked")
      const defaultDateWanted = $('#checkboxDefaultDate').is(":checked")
      const payoffDateWanted = $('#checkboxPayoffDate').is(":checked")

      return {
        fundStartDate,
        fundEndDate,
        payoffStartDate,
        payoffEndDate,
        loanStatus,
        state,
        addressWanted,
        emailWanted,
        stateWanted,
        remainingPaymentsWanted,
        balanceWanted,
        defaultDateWanted,
        payoffDateWanted,
        recoveryLoans,
        recoveryBalanceWanted,
        recoveryDateWanted,
        judgementWanted,
      }
    }

    const filterOnClick = () => {
      filterLoans(getFilters())
    }

    const exportOnClick = () => {
      exportLoans(getFilters())
    }

    let exportButton
    if (isExportLoansFetching) {
      exportButton = <div>Loading</div>
    }
    else if (exportLoansFailed) {
      exportButton = <div>Errors</div>
    }
    else {
      exportButton = <Button onClick={exportOnClick.bind(this)} bsStyle="primary">Export</Button>
    }

    return (
      <Panel header="Loan Filtering Widget">

        <form className="form-horizontal">
          <fieldset>
            <div className="form-group">
              <label className="col-lg-2 control-label">Fund date range</label>
              <Col lg={ 3 }>
                <input type="text" id="fundStartDate" className="form-control"/>
                <span className="help-block m-b-none">Fund start date (note date)</span>
                <span className="help-block m-b-none">Defaults to 1 month ago if not provided</span>
              </Col>
              <Col lg={ 3 }>
                <input type="text" id="fundEndDate" className="form-control"/>
                <span className="help-block m-b-none">Fund end date (note date)</span>
                <span className="help-block m-b-none">Defaults to current date if not provided</span>
              </Col>
            </div>
          </fieldset>

          <fieldset>
            <div className="form-group">
              <label className="col-lg-2 control-label">Payoff date range</label>
              <Col lg={ 3 }>
                <input type="text" id="payoffStartDate" className="form-control"/>
                <span className="help-block m-b-none">Payoff start date</span>
              </Col>
              <Col lg={ 3 }>
                <input type="text" id="payoffEndDate" className="form-control"/>
                <span className="help-block m-b-none">Payoff end date</span>
              </Col>
            </div>
          </fieldset>

          <fieldset>
            <div className="form-group">
              <label className="col-lg-2 control-label">Loan status</label>
              <Col lg={ 10 }>
                { loanStatusRadioButtons }
              </Col>
            </div>
          </fieldset>

          <fieldset>
            <div className="form-group">
              <label className="col-sm-2 control-label">State</label>
              <Col sm={ 10 }>
                <Row>
                  <div className="col-lg-4">
                    <select id="stateOption" className="form-control">
                      { statesDropdown }
                    </select>
                  </div>
                </Row>
              </Col>
            </div>
          </fieldset>

          <fieldset>
            <div className="form-group">
              <label className="col-sm-2 control-label">More filters</label>
              <Col sm={ 10 }>
                <div className="checkbox c-checkbox needsclick">
                  <label className="needsclick">
                    <input id={'checkboxRecoveryLoans'} type="checkbox" className="needsclick"/>
                    <em className="fa fa-check"/>RecoveryLoans
                  </label>
                  <span className="help-block m-b-none">Only matched loans will get populated in table and report</span>
                </div>
              </Col>
            </div>
          </fieldset>

          <fieldset>
            <div className="form-group">
              <label className="col-sm-2 control-label">Configurable columns</label>
              <Col sm={ 10 }>
                { configurableColumnsCheckbox }
              </Col>
            </div>
          </fieldset>

          <div className="form-group">
            <Col lgOffset={ 2 } lg={ 3 }>
              <Button onClick={filterOnClick.bind(this)} bsStyle="primary">Filter</Button>
              <span className="help-block m-b-none">Filter loans and see results in table below</span>
            </Col>

            <Col lgOffset={ 1 } lg={ 3 }>
              { exportButton }
              <span className="help-block m-b-none">Filter loans and see results in PDF</span>
            </Col>
          </div>
        </form>
      </Panel>
    )
  }
}
