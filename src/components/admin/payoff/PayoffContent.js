import React from 'react'
import ContentWrapper from '../../../themeJsx/Layout/ContentWrapper';
import { Row, Col, Panel, Alert, ButtonGroup, Button, Table } from 'react-bootstrap';
import { Link } from 'react-router';

export const PayoffContent = ({
  loanId,
  payoff,
  getPayoffFormState,
  getPayoffForm
}) => {
  const { payoffData, payoffAmountList } = payoff

  const loanListDisplay = payoffAmountList.map( (payoffEntry, i)  => {
    return (
      <tr key={i}>
        <td className="wd-xs">
          {payoffEntry.payoffDate}
        </td>
        <td className="wd-xs">
          {payoffEntry.payoffInterest}
        </td>
        <td className="wd-xs">
          ${payoffEntry.payoffAmount}
        </td>
      </tr>
    )
  })

  const getPayoffFormOnclick = () => {
    getPayoffForm(loanId)
  }

  let getPayoffFormButton
  if (getPayoffFormState.isFetching) {
    getPayoffFormButton = <p>Loading file</p>
  }
  else if (getPayoffFormState.isFailed) {
    getPayoffFormButton = <p>Failed to load file. Please refresh and try again</p>
  }
  else {
    getPayoffFormButton =
      <div className="panel-footer text-center">
        <button className="btn btn-info" bsSize="large" onClick={getPayoffFormOnclick.bind(this)}>
          One time payoff authorization form
        </button>
      </div>
  }

  return (
    <ContentWrapper>
      <Row>
        <Col md={ 6 }>
          <Panel className="panel-default" header="Payoff Amount For Next 30 Days">
            <Row>
              <Col md={ 12 }>
                <Table responsive striped hover>
                  <thead>
                  <tr>
                    <th>Payoff Date</th>
                    <th>Payoff Interest</th>
                    <th>Payoff Amount</th>
                  </tr>
                  </thead>

                  <tbody>
                  { loanListDisplay }
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Panel>
        </Col>

        <Col md={ 6 }>
          <Panel className="panel-default" header="Payoff Info">
            <div className="list-group-item">
              <span className="pull-right">${payoffData.balanceFromLastPayment}</span>
              <div className="text-bold">Balance from last payment:</div>
            </div>

            <div className="list-group-item">
              <span className="pull-right">{payoffData.lastPaymentDate}</span>
              <div className="text-bold">Last payment date:</div>
            </div>
            <div className="list-group-item">
              <span className="pull-right">{payoffData.interestFromNextPayment}%</span>
              <div className="text-bold">Payoff interest rate:</div>
            </div>

            { getPayoffFormButton }
          </Panel>
        </Col>
      </Row>
    </ContentWrapper>
  )
}
