import React from 'react'
import { Grid, Row, Col, Panel, Button } from 'react-bootstrap';

import { PaymentPlanTable } from './PaymentPlanTable'
import { PaymentStatusTabs } from './PaymentStatusTabs'

export const PaymentPlanContent = ({tabList, selectedPaymentStatus, paymentList, onClickPaymentTab}) => (
  <Panel className="panel-default" header="Payment schedule plan">
    <Row className="text-center">
      <Button bsStyle="info" className="mb-sm">Payoff Loan</Button>
    </Row>

    <Grid fluid>
      <Row>
        <Col md={12}>
          { /* payment table */ }
          <Row>
            <PaymentStatusTabs tabList={tabList}
                               selectedTab={selectedPaymentStatus}
                               onClickPaymentTab={onClickPaymentTab}/>
          </Row>

          <Row>
            <PaymentPlanTable paymentList={paymentList} selectedTab={selectedPaymentStatus}/>
          </Row>
        </Col>
      </Row>
    </Grid>
  </Panel>
)
