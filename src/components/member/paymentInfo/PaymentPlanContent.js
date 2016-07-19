import React from 'react'
import { Grid, Row, Col, Panel, Button } from 'react-bootstrap';

import { PaymentPlanTable } from './PaymentPlanTable'
import { PaymentStatusTabs } from './PaymentStatusTabs'
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner'

export const PaymentPlanContent = ({paymentsData, tabList, shouldDisplayPayoff, selectedPaymentStatus, onClickPaymentTab}) => {
  const { isFetching, fetchPaymentsFailed, paymentList } = paymentsData

  // display different components based on the status of getLoanList api call
  let displayContent
  if (isFetching) {
    displayContent = <LoadingSpinner/>
  }
  else if (fetchPaymentsFailed) {
    displayContent = <FailureWidget/>
  }
  else {
    displayContent = <PaymentPlanTable paymentList={paymentList} selectedTab={selectedPaymentStatus}/>
  }

  return (
    <Panel className="panel-default" header="Payments schedule">
      {
        shouldDisplayPayoff &&
        <Row className="text-center">
          <Button bsStyle="info" className="mb-sm">Payoff Loan</Button>
        </Row>
      }

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