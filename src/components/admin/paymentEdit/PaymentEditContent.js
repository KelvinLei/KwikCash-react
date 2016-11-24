import React, { Component } from 'react'
import ContentWrapper from '../../../themeJsx/Layout/ContentWrapper';
import { Row, Col, Panel, Alert, ButtonGroup, Button, Table } from 'react-bootstrap';
import { PAYMENT_TYPE, SCHEDULE_TYPE } from '../../shared/constants'
import Calender from './Calendar'
var moment = require('moment')

require('pikaday/pikaday.js')
require('pikaday/plugins/pikaday.jquery.js')
require('pikaday/css/pikaday.css')

export default class PaymentEditContent extends Component {

  componentDidMount() {
    Calender()
  }

  render() {
    const { payment, editPaymentState, editPayment } = this.props

    const paymentEditOnClick = () => {
      const paymentScheduled = $('input[name=paymentScheduledRadio]:checked').val()
      const paymentMethod = $('input[name=paymentMethodRadio]:checked').val()

      const amountDue = $('#input-amountDue').val()
      const amountPaid = $('#input-amountPaid').val()
      const paymentDate = $('#input-paymentDate').val()
      // const principal = $('#input-principal').val()
      // const interest = $('#input-interest').val()
      const rate = $('#input-rate').val()

      editPayment({
        paymentId             : payment.paymentId,
        loanId                : payment.loanId,
        principal             : payment.principal,
        interest              : payment.interest,
        currPaymentScheduled  : payment.scheduled,
        paymentScheduled,
        paymentMethod,
        amountDue,
        amountPaid,
        paymentDate,
        rate,
      })
    }

    const paymentInput = [
      { label: "Amount Due", fieldName: "amountDue"},
      { label: "Amount Paid", fieldName: "amountPaid"},
      { label: "Payment Date", fieldName: "paymentDate"},
      { label: "APR Rate", fieldName: "rate"},
      // { label: "Principal", fieldName: "principal"},
      // { label: "Interest", fieldName: "interest"},
    ]

    const paymentInputWidget = paymentInput.map( (input, i) => {
      const defaultValue = payment[input.fieldName]

      return (
        <fieldset key={i}>
          <div className="form-group">
            <label className="col-lg-2 control-label">{input.label}</label>
            <Col lg={ 4 }>
              <input type="text" id={"input-"+input.fieldName} defaultValue={defaultValue} className="form-control"/>
            </Col>
          </div>
        </fieldset>
      )
    })

    const paymentScheduledWidget =
      Object.keys(SCHEDULE_TYPE).map( (scheduleCode, i) => {
        const defaultChecked = scheduleCode == payment.scheduled ? 'defaultChecked' : ''
        const id = "paymentScheduled-" + scheduleCode
        return (
          <Col lg={ 3 } key={i} >
            <label key={"label"+id} className="radio-inline c-radio">
              <input id={id} type="radio"
                     defaultValue={scheduleCode}
                     name="paymentScheduledRadio"
                     defaultChecked={defaultChecked}
              />
              <em className="fa fa-circle"/>{SCHEDULE_TYPE[scheduleCode]}
            </label>
          </Col>
        )
      })

    const paymentMethodWidget =
      Object.keys(PAYMENT_TYPE).map( (methodCode, i) => {
        const defaultChecked = methodCode == payment.paymentMethod ? 'defaultChecked' : ''
        const id = "paymentMethod-" + methodCode
        return (
          <Col lg={ 3 } key={i} >
            <label key={"label"+id} className="radio-inline c-radio">
              <input id={id} type="radio"
                     defaultValue={methodCode}
                     name="paymentMethodRadio"
                     defaultChecked={defaultChecked}
              />
              <em className="fa fa-circle"/>{PAYMENT_TYPE[methodCode]}
            </label>
          </Col>
        )
      })

    return (
      <ContentWrapper>
        <Row>
          <Col lg={ 12 } >
            <Panel header="Payment Info">
              <form className="form-horizontal">
                <fieldset>
                  <div className="form-group">
                    <label className="col-lg-2 control-label">Loan Number</label>
                    <Col lg={ 8 }>
                      <div className="form-control-static"> {payment.loanNumber}</div>
                    </Col>
                  </div>
                </fieldset>

                <fieldset>
                  <div className="form-group">
                    <label className="col-lg-2 control-label">Member Name</label>
                    <Col lg={ 8 }>
                      <div className="form-control-static"> {payment.memberName}</div>
                    </Col>
                  </div>
                </fieldset>

                <fieldset>
                  <div className="form-group">
                    <label className="col-lg-2 control-label">Payment ID</label>
                    <Col lg={ 8 }>
                      <div className="form-control-static"> {payment.paymentId}</div>
                    </Col>
                  </div>
                </fieldset>

                { paymentInputWidget }

                <fieldset>
                  <div className="form-group">
                    <label className="col-lg-2 control-label">Scheduled Payment</label>
                    <Col lg={ 8 }>
                      <Row>
                        { paymentScheduledWidget }
                      </Row>
                    </Col>
                  </div>
                </fieldset>

                <fieldset>
                  <div className="form-group">
                    <label className="col-lg-2 control-label">Payment Method</label>
                    <Col lg={ 8 }>
                      <Row>
                        { paymentMethodWidget }
                      </Row>
                    </Col>
                  </div>
                </fieldset>
              </form>
            </Panel>
          </Col>
        </Row>

        <Panel>
          <div className="panel-footer text-center">
            <button onClick={paymentEditOnClick.bind(this)}
                    className="btn btn-info"
                    bsSize="large"
                    disabled={editPaymentState.isFetching}
            >
              Save Changes
            </button>
          </div>
        </Panel>

        <Row>
          <Col lg={ 12 } >
            {
              editPaymentState.editSuccess &&
              <Alert bsStyle="success" className="text-center">
                <strong>Success - </strong> Payment has been updated!
              </Alert>
            }
            {
              editPaymentState.isFailed &&
              <Alert bsStyle="danger" className="text-center">
                <strong>Error - </strong> Payment failed to get updated! Please refresh and try agian.
              </Alert>
            }
          </Col>
        </Row>

      </ContentWrapper>
    )
  }
}
