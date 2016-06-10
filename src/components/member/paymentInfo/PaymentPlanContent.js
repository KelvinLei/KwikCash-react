import React, { Component } from 'react'
import ContentWrapper from '../../../themeJsx/Layout/ContentWrapper';
import { Grid, Row, Col } from 'react-bootstrap';

import PaymentPlanTable from './PaymentPlanTable'
import PaymentStatusTabs from './PaymentStatusTabs'
import PayOffButton from './PayOffButton'

export default class PaymentPlanContent extends Component {
  render() {
    const { tabList, selectedTab, paymentList, onClickPaymentTab} = this.props;

    return (
      <ContentWrapper>
        <div className="content-heading">
          Payment plan summary
          <small data-localize="dashboard.WELCOME">Loan ID: 1234</small>
        </div>

        <Grid fluid>
          <Row>
            <Col lg={12}>
              <Row>
                <PayOffButton/>
              </Row>

              <Row>
                <PaymentStatusTabs tabList={tabList} selectedTab={selectedTab} onClickPaymentTab={onClickPaymentTab}/>
              </Row>

              <Row>
                <PaymentPlanTable paymentList={paymentList} selectedTab={selectedTab}/>
              </Row>
            </Col>
          </Row>
        </Grid>
      </ContentWrapper>
    )
  }
}
