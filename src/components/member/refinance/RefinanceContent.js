import React from 'react'
import ContentWrapper from '../../../themeJsx/Layout/ContentWrapper';
import { Row, Col, Panel } from 'react-bootstrap';
import { RefinanceValueOptions } from './RefinanceValueOptions'
import { EstimateTable } from './EstimateTable'
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner'
import {sendCounterMetrics, sendRefinanceRequest, METRICS_NAME_REFINANCE_BTN_COUNT} 
  from "../../../api/memberApiClient";
import stylings from './refinanceStylings.scss'

require("sweetalert/dist/sweetalert.min")
require("sweetalert/dist/sweetalert.css")

export const RefinanceContent = ({
  loanId,
  loanData,
  refinanceState,
  refinanceValueForTable,
  newBalance,
  onClickRefinanceValue,
  onClickUserRefinanceValue,
  onEnterUserFinanceValue
}) => {
  const displayContent = loanData ?
    <RefinanceContentBody
      loanId={loanId}
      loanData={loanData}
      refinanceState={refinanceState}
      refinanceValueForTable={refinanceValueForTable}
      newBalance={newBalance}
      onClickRefinanceValue={onClickRefinanceValue}
      onClickUserRefinanceValue={onClickUserRefinanceValue}
      onEnterUserFinanceValue={onEnterUserFinanceValue} />
    :
    <LoadingSpinner/>

  return (
    <ContentWrapper>
      { /* header */}
      <div className="content-heading">
        Refinance options
        <small data-localize="dashboard.WELCOME">Selected loan ID: {loanId}</small>
      </div>

      { displayContent }
    </ContentWrapper>
  )
}

const RefinanceContentBody = ({
  loanId,
  loanData,
  refinanceState,
  refinanceValueForTable,
  newBalance,
  onClickRefinanceValue,
  onClickUserRefinanceValue,
  onEnterUserFinanceValue
}) => {

  const refinanceOptions = [2000, 3000, 4000, 5000];

  const currentBalance = loanData.balance

  const selectedRefinanceValue = refinanceState.userInputRefinanceValue.selected ?
    refinanceState.userInputRefinanceValue.value
    : refinanceState.refinanceValue;

  const showRefinanceModal = () => {
    swal({
        title: "Refinance your loan?",
        text: "New loan balance: $" + selectedRefinanceValue,
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
        closeOnConfirm: false,
        closeOnCancel: true },
      (isConfirm) => {
        if (isConfirm) {
          sendRefinanceRequest(loanData.loanNumber, currentBalance, selectedRefinanceValue).then(() => {
            swal("Got it!", "Your refinance request is being processed. We will email you when your application has completed", "success");
          }).catch(() => {
            sweetAlert("Oops...", "Something went wrong! Please try again", "error");
          })
        }
      });
  }
  
  const refinanceBtnOnclick = () => {
    showRefinanceModal()
    sendCounterMetrics(METRICS_NAME_REFINANCE_BTN_COUNT, [])
  }

  const isSelectedRefinanceValueValid = parseInt(selectedRefinanceValue) >= currentBalance

  return (
    <div>
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
                                 currentBalance={currentBalance}
                                 shouldDisplayAlert={!isSelectedRefinanceValueValid}
                                 onClickRefinanceValue={onClickRefinanceValue}
                                 onClickUserRefinanceValue={onClickUserRefinanceValue}
                                 onEnterUserFinanceValue={onEnterUserFinanceValue}
          />
        </Col>

        <Col md={ 6 }>
          <EstimateTable key="estimateTable"
                         currentBalance={currentBalance}
                         refinanceValueForTable={refinanceValueForTable}
                         newBalance={newBalance}
                         shouldShowNewBalance={isSelectedRefinanceValueValid}
          />
        </Col>
      </Row>

      { /* refinance button */}
      <Row>
        <Col md={ 4 } mdOffset={ 4 } className="text-center">
          <Panel>
            <button type="button" class="btn btn-info"
                    disabled={!isSelectedRefinanceValueValid ? 'disabled' : ''}
                    onClick={refinanceBtnOnclick}>
                    Proceed to refinance
            </button>
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
    </div>
  )
}
