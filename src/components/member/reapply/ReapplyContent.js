import React, { Component } from 'react'
import ContentWrapper from '../../../themeJsx/Layout/ContentWrapper';
import {Row, Col, Panel, Button, Alert } from 'react-bootstrap';
import runParsley from './runParsley'
import { sendCounterMetrics, METRICS_NAME_REAPPLY_BTN_COUNT } from "../../../api/memberApiClient";
require('../shared/parsley.scss');
require('parsleyjs/dist/parsley.min.js')

export default class ReapplyContent extends Component {

  componentDidMount() {
    runParsley()
  }

  render() {
    const { reapplyState, submitReapply } = this.props
    const {
      isSubmitting,
      lastApplication, } = reapplyState

    const loanAmount = [
      2500,
      3000,
      3500,
      4000,
      4500,
      5000,
    ]

    const loanAmountRadios = loanAmount.map( (amount, i) => {
      const defaultChecked = i == 0 ? 'defaultChecked' : ''
      const id = "loanAmount-" + amount
      return (
        <Col md={2} key={i}>
          <label key={"label"+id} className="radio-inline c-radio">
            <input id={id} type="radio" defaultValue={amount} name="loanAmountRadio" defaultChecked={defaultChecked}/>
            <em className="fa fa-circle"/>${amount}
          </label>
        </Col>
      )
    })

    const reapplyOnclick = (e) => {
      e.preventDefault()
      if (!$('form[data-parsley-validate]').parsley().isValid()) return false

      sendCounterMetrics(METRICS_NAME_REAPPLY_BTN_COUNT, [])

      const firstName = $('#firstNameInput').val()
      const middleInitial = $('#middleInitialInput').val()
      const lastName = $('#lastNameInput').val()
      const homePhoneNumber = $('#homePhoneNumber').val()
      const mobilePhoneNumber = $('#mobilePhoneNumber').val()
      const loanAmount = $('input[name=loanAmountRadio]:checked').val()
      submitReapply({
        firstName,
        middleInitial,
        lastName,
        homePhoneNumber,
        mobilePhoneNumber,
        loanAmount,
      })
    }

    return (
      <ContentWrapper>
        <div className="content-heading">
          Re-apply
        </div>

        <Panel className="panel-success" header="Application">
          <form onSubmit={reapplyOnclick.bind(this)} data-parsley-validate="" role="form">
            <Row>
              <Col md={ 3 }>
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" id="firstNameInput" className="form-control"
                         defaultValue={lastApplication.firstName}
                         data-parsley-required="true"
                         data-parsley-type="alphanum"
                  />
                </div>
              </Col>
              <Col md={ 2 }>
                <div className="form-group">
                  <label>Middle Initial</label>
                  <input type="text" id="middleInitialInput" className="form-control"
                         defaultValue={lastApplication.middleInitial}
                         data-parsley-type="alphanum"
                         data-parsley-length="[0, 1]"
                  />
                </div>
              </Col>
              <Col md={ 3 }>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" id="lastNameInput" className="form-control"
                         defaultValue={lastApplication.lastName}
                         data-parsley-required="true"
                         data-parsley-type="alphanum"
                  />
                </div>
              </Col>
            </Row>

            <Row>
              <Col md={ 5 }>
                <div className="form-group">
                  <label>Home Phone</label>
                  <input type="tel" id="homePhoneNumber" className="form-control"
                         defaultValue={lastApplication.homePhone}
                         data-parsley-required="true"
                         data-parsley-pattern="/^\d{3}-?\d{3}-?\d{4}$/"
                         data-parsley-error-message="Format needs to be XXX-XXX-XXXX"
                  />
                </div>
              </Col>
              <Col md={ 5 }>
                <div className="form-group">
                  <label>Mobile Phone</label>
                  <input type="tel" id="mobilePhoneNumber" className="form-control"
                         defaultValue={lastApplication.mobilePhone}
                         data-parsley-required="true"
                         data-parsley-pattern="/^\d{3}-\d{3}-\d{4}$/"
                         data-parsley-error-message="Format needs to be XXX-XXX-XXXX"
                  />
                </div>
              </Col>
            </Row>

            <Row>
              <Col md={ 12 }>
                <div className="form-group">
                  <label>Loan Amount</label>
                  <Row>
                    <Col md={ 12 }>
                      { loanAmountRadios }
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>

            <div className="panel-footer text-center">
              <Button type="submit"
                      bsClass="btn btn-labeled btn-success mr"
                      bsSize="large"
                      disabled={isSubmitting}
              >
                <span className="btn-label"><i className="fa fa-check"/></span> Agree & Submit
              </Button>
            </div>
          </form>
        </Panel>

        <Panel className="panel-info" header="Consent">
          <p className="form-control-static">You understand that by clicking on the 'AGREE & SUBMIT' button immediately following this notice, you are providing 'written instructions' to KwikCash, Inc. under the Fair Credit Reporting Act authorizing KwikCash, Inc. to obtain information from your personal credit profile or other information from Experian. You authorize KwikCash, Inc. to obtain such information solely to confirm your identity.</p>
        </Panel>
      </ContentWrapper>
    )
  }
}
