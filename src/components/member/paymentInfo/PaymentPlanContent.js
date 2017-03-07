import React from 'react'
import { Grid, Row, Col, Panel, Button, Dropdown, MenuItem } from 'react-bootstrap';

import { PaymentPlanTable } from './PaymentPlanTable'
import { PayoffAmountTable } from '../loanSummary/PayoffAmountTable'
import { PaymentStatusTabs } from './PaymentStatusTabs'
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner'
import {sendCounterMetrics, METRICS_NAME_PAYOFF_BTN_COUNT} from "../../../api/memberApiClient";

require("sweetalert/dist/sweetalert.min")
require("sweetalert/dist/sweetalert.css")

export const PaymentPlanContent = ({
  loanData,
  paymentsData,
  customerName,
  tabList,
  isPayoffRequestAllowed,
  shouldDisplayPayoff,
  onClickPaymentTab,
  onClickPaymentYear,
  onClickPayoff
}) => {
  const { isFetching,
    fetchPaymentsFailed,
    loanId,
    loanNumber,
    paymentSchedule,
    paymentList,
    selectedPaymentYear,
    paymentYearsList,
    selectedPaymentStatus } = paymentsData

  // display different components based on the status of getLoanList api call
  let displayContent
  // for payoff tabe
  if (selectedPaymentStatus == 'Payoff') {
    displayContent = <PayoffAmountTable payoffData={loanData.payoffData} />
  }
  // for All, Paid, Pending tabs
  else {
    if (isFetching) {
      displayContent = <LoadingSpinner/>
    }
    else if (fetchPaymentsFailed) {
      displayContent = <FailureWidget/>
    }
    else {
      displayContent = <PaymentPlanTable paymentList={paymentList}/>
    }
  }

  const handleOnClickPaymentsYear = (event) => onClickPaymentYear(event.target.text, loanId)

  const showPayoffRequestModal = (e) => {
    e.preventDefault();
    swal({
        title: "Payoff request",
        text: `Please confirm of the payoff request, and our staff will reach out to you`,
        showCancelButton: true,
        closeOnConfirm: false,
        animation: "slide-from-top", },
      (isConfirm) => {
        if (isConfirm) {
          onClickPayoff(loanNumber).then(() => {
            swal("Got it!", "Your payoff request is being processed. Our staff will contact your shortly", "success");
          }).catch(() => {
            sweetAlert("Oops...", "Something went wrong! Please try again", "error");
          })
        }
      });
  }

  const showContactOfficePayoffModal = (e) => {
    e.preventDefault();
    swal({
        title: "Payoff request",
        text: `Please call our office 1-800-478-6230 to payoff your loan. Thanks`,
        showCancelButton: true,
        closeOnConfirm: true,
        animation: "slide-from-top",
      });
  }

  const payoffOnClick = (e) => {
    if (isPayoffRequestAllowed) {
      showPayoffRequestModal(e)
    }
    else {
      showContactOfficePayoffModal(e)
    }
    sendCounterMetrics(METRICS_NAME_PAYOFF_BTN_COUNT, [])
  }

  return (
    <Panel className="panel-default" header="Payments schedule">
      <Row className="text-center">
        <Col sm={6} xs={12}>
          <Dropdown id="dropdown-custom-1">
            <Dropdown.Toggle>
              <strong>View payments by year ({selectedPaymentYear})</strong>
            </Dropdown.Toggle>
            <Dropdown.Menu className="fadeIn">
              {/* populate all possible years in which payments are due */}
              { paymentYearsList.map( (year) => <MenuItem key={year} eventKey={year} onClick={handleOnClickPaymentsYear}>{year}</MenuItem> )}

              <MenuItem divider />
              <MenuItem eventKey="4" onClick={handleOnClickPaymentsYear}>All</MenuItem>
            </Dropdown.Menu>
          </Dropdown>
        </Col>

        {
          shouldDisplayPayoff &&
          <Col sm={6} xs={12}>
            <Button onClick={payoffOnClick} bsStyle="info" className="mb-sm">Payoff Loan</Button>
          </Col>
        }
      </Row>

      <Grid fluid>
        <Row>
          <Col md={12}>
            { /* payment status tabs */ }
            <Row>
              <PaymentStatusTabs tabList={tabList}
                                 selectedTab={selectedPaymentStatus}
                                 onClickPaymentTab={onClickPaymentTab}/>
            </Row>

            { /* payment table */ }
            <Row>
              { displayContent }
            </Row>
          </Col>
        </Row>
      </Grid>
    </Panel>
  )
}

/*
 Renders error messagings
 */
const FailureWidget = () => (
  <Row>
    <Col md={ 12 }>
      Sorry, we failed to retrieve your data. Please try again or contact us.
    </Col>
  </Row>
)