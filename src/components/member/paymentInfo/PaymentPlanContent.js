import React from 'react'
import { Grid, Row, Col, Panel, Button, Dropdown, MenuItem } from 'react-bootstrap';

import { PaymentPlanTable } from './PaymentPlanTable'
import { PaymentStatusTabs } from './PaymentStatusTabs'
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner'

require("sweetalert/dist/sweetalert.min")
require("sweetalert/dist/sweetalert.css")

export const PaymentPlanContent = ({
  paymentsData,
  customerName,
  tabList,
  shouldDisplayPayoff,
  onClickPaymentTab,
  onClickPaymentYear,
  onClickPayoff
}) => {
  const { isFetching,
    fetchPaymentsFailed,
    loanId,
    paymentSchedule,
    paymentList,
    selectedPaymentYear,
    paymentYearsList,
    selectedPaymentStatus } = paymentsData

  // display different components based on the status of getLoanList api call
  let displayContent
  if (isFetching) {
    displayContent = <LoadingSpinner/>
  }
  else if (fetchPaymentsFailed) {
    displayContent = <FailureWidget/>
  }
  else {
    displayContent = <PaymentPlanTable paymentList={paymentList}/>
  }

  const handleOnClickPaymentsYear = (event) => onClickPaymentYear(event.target.text, loanId)

  const showPayoffModal = () => {
    swal({
        title: "Payoff request for loan id " + loanId,
        text: "We have been notified of your payoff request. Our staff will contact your shortly",
        confirmButtonText: "Okay",
        closeOnConfirm: false })
  }

  const handlePayoff = () => {
    onClickPayoff(loanId, customerName)
    showPayoffModal()
  }

  return (
    <Panel className="panel-default" header="Payments schedule">
      <Row className="text-center">
        <Col xs={6}>
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
          <Col xs={6}>
            <Button onClick={handlePayoff} bsStyle="info" className="mb-sm">Payoff Loan</Button>
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