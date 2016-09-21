import React from 'react'
import states from './states_info'
import { Row, Col, Panel, Button } from 'react-bootstrap';

export const LoanFilterWidget = ( {filterLoans} ) => {

  var LOAN_STATUS_MAP = {
    ALL: 'All',
    A: 'Active',
    L: 'Late',
    M: 'Manual',
    P: 'Paid',
    D: 'Charged off',
    F: 'Plan'
  }

  var CONFIGURABLE_COLUMNS = [
    'Address', 'Email', 'State', 'RemainingPayments', 'Balance', 'DefaultDate', 'PayoffDate'
  ]

  const configurableColumnsCheckbox = CONFIGURABLE_COLUMNS.map( (column) => {
    return (
      <div className="checkbox c-checkbox needsclick">
        <label className="needsclick">
          <input id={'checkbox' + column} type="checkbox" className="needsclick"/>
          <em className="fa fa-check"/>{column}
        </label>
      </div>
    )
  })

  const statesDropdown = states.map( (state, id) => {
    return (
      <option key={id} defaultValue={state.abbreviation}>
        {state.abbreviation} - {state.name}
      </option>
    )
  })

  const loanStatusRadioButtons = Object.keys(LOAN_STATUS_MAP).map( (statusCode, i) => {
    const defaultChecked = i == 0 ? 'defaultChecked' : ''
    const id = "loanStatus-" + statusCode
    return (
      <label key={"label"+id} className="radio-inline c-radio">
        <input id={id} type="radio" defaultValue={statusCode} name="loanStatusRadio" defaultChecked={defaultChecked}/>
        <em className="fa fa-circle"/>{LOAN_STATUS_MAP[statusCode]}
      </label>
    )
  })

  const filterOnClick = (e) => {
    const fundStartDate = $('#fundStartDate').val()
    const fundEndDate = $('#fundEndDate').val()
    const loanStatus = $('input[name=loanStatusRadio]:checked').val()
    const state = $('#stateOption').val().split('-')[0].trim()
    const excludeLoansUnder1001 = $('#excludeLoansUnder1001').is(":checked")

    filterLoans()
  }

  return (
    <Panel header="Loan Filtering Widget">

      <form className="form-horizontal">
        <fieldset>
          <div className="form-group">
            <label className="col-lg-2 control-label">Fund date range</label>
            <Col lg={ 3 }>
              <input type="text" id="fundStartDate" className="form-control"/>
              <span className="help-block m-b-none">Fund start date</span>
            </Col>
            <Col lg={ 3 }>
              <input type="text" id="fundEndDate" className="form-control"/>
              <span className="help-block m-b-none">Fund end date</span>
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
            <Button bsStyle="primary">Export</Button>
            <span className="help-block m-b-none">Filter loans and see results in PDF</span>
          </Col>
        </div>
      </form>
    </Panel>
  )
}