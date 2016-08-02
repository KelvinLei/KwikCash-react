import React from 'react'
import ContentWrapper from '../../../themeJsx/Layout/ContentWrapper';
import { Row, Col, Panel } from 'react-bootstrap';
import RefinanceValueOptions from './RefinanceValueOptions'
import { EstimateTable } from './EstimateTable'

require("sweetalert/dist/sweetalert.min")
require("sweetalert/dist/sweetalert.css")

export const RefinanceContent = ({
  loanId,
  currentBalance,
  refinanceState,
  refinanceValueForTable,
  newBalance,
  onClickRefinanceValue,
  onClickUserRefinanceValue,
  onEnterUserFinanceValue
}) => {
  const refinanceOptions = [2000, 3000, 4000, 5000];

  const showRefinanceModal = () => {
    swal({
      title: "Refinance your loan?",
      text: "New loan balance: $" + refinanceState.refinanceValue,
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      closeOnConfirm: false,
      closeOnCancel: true },
      (isConfirm) => {
        if (isConfirm) {
          swal("Got it!", "Your refinance request is being processed. We will email you when your application has completed", "success");
        }
      });
  }

  return (
    <ContentWrapper>
      { /* header */}
      <div className="content-heading">
        Refinance options
        <small data-localize="dashboard.WELCOME">Selected loan ID: {loanId}</small>
      </div>

      <Row>
        <Col xs={12} className="text-center">
          <h4>Current balance: ${currentBalance}</h4>
        </Col>
      </Row>

      { /* refinance value and table */}
      <Row>
        <Col md={ 6 }>
          <RefinanceValueOptions refinanceState={refinanceState}
                                 valueList={refinanceOptions}
                                 onClickRefinanceValue={onClickRefinanceValue}
                                 onClickUserRefinanceValue={onClickUserRefinanceValue}
                                 onEnterUserFinanceValue={onEnterUserFinanceValue}
          />
        </Col>

        <Col md={ 6 }>
          <EstimateTable key="estimateTable" currentBalance={currentBalance} refinanceValueForTable={refinanceValueForTable} newBalance={newBalance} />
        </Col>
      </Row>

      { /* refinance button */}
      <Row>
        <Col md={ 4 } mdOffset={ 4 } className="text-center">
          <Panel>
            <button type="button" onClick={showRefinanceModal} class="btn btn-info">Proceed to refinance</button>
          </Panel>
        </Col>
      </Row>

      { /* refinance instructions */}
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
