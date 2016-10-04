import React from 'react'
import ContentWrapper from '../../../themeJsx/Layout/ContentWrapper';
import { Row, Col, Panel, Alert, ButtonGroup, Button, Table } from 'react-bootstrap';
import { Link } from 'react-router';

export const PayoffContent = ({
  payoff,
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
        </Panel>
      </Col>
      </Row>
    </ContentWrapper>
  )
}
