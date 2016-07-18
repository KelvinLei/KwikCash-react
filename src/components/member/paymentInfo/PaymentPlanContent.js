import React from 'react'
import { Grid, Row, Col, Panel, Button } from 'react-bootstrap';

import { PaymentPlanTable } from './PaymentPlanTable'
import { PaymentStatusTabs } from './PaymentStatusTabs'

export const PaymentPlanContent = ({tabList, shouldDisplayPayoff, selectedPaymentStatus, paymentList, onClickPaymentTab}) => (
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
            <PaymentPlanTable paymentList={paymentList} selectedTab={selectedPaymentStatus}/>
          </Row>
        </Col>
      </Row>
    </Grid>
  </Panel>
)
