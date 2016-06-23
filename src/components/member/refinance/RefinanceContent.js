import React, { Component } from 'react'
import ContentWrapper from '../../../themeJsx/Layout/ContentWrapper';
import { Row, Col, Panel } from 'react-bootstrap';
import RefinanceValueSelect from './RefinanceValueSelect'
import EstimateTable from './EstimateTable'

export default class RefinanceContent extends Component {
  render() {
    var {currentBalance, refinanceValue, newBalance, onClickRefinanceValue} = this.props

    const refinanceOptions = [2000.00, 3000.00, 4000.00, 5000.00];

    return (
      <ContentWrapper>
        { /* header */}
        <div className="content-heading">
          Refinance options
          <small data-localize="dashboard.WELCOME">Selected loan ID: 1234</small>
        </div>

        <Row>
          <Col xs={12} className="text-center">
            <h4>Current balance: ${currentBalance}</h4>
          </Col>
        </Row>

        { /* refinance value and table */}
        <Row>
          <Col md={ 6 }>
            <RefinanceValueSelect refinanceValue={refinanceValue} valueList={refinanceOptions} onClickRefinanceValue={onClickRefinanceValue}/>
          </Col>

          <Col md={ 6 }>
            <EstimateTable key={Math.random()} currentBalance={currentBalance} refinanceValue={refinanceValue} newBalance={newBalance} />
          </Col>
        </Row>

        <Row>
          <Col md={ 4 } mdOffset={ 4 } className="text-center">
            <Panel>
                <button type="button" class="btn btn-info">Proceed to refinance</button>
            </Panel>
          </Col>
        </Row>

        <Row>
          <Col md={ 4 } mdOffset={ 4 }>
            <div id="panelDemo10" className="panel panel-default">
              <div className="panel-heading">Why Refinance?</div>
              <div className="panel-body">
                <p>Get additional funds deposited within 24 hours</p>
                <p>You may qualify for a lower rate</p>
                <p>Pay off your existing loan with a new loan</p>
                <p>New payment plan schedule</p>
              </div>
            </div>
          </Col>
        </Row>
      </ContentWrapper>
    )
  }
}
