import React, { Component } from 'react'
import ContentWrapper from '../../../themeJsx/Layout/ContentWrapper';
import { Grid, Row, Col, Panel } from 'react-bootstrap';

import PaymentPlanTable from './PaymentPlanTable'
import PaymentStatusTabs from './PaymentStatusTabs'
import PayOffButton from './PayOffButton'

export default class PaymentPlanContent extends Component {
  render() {
    const { tabList, selectedTab, paymentList, onClickPaymentTab} = this.props;

    return (
      <ContentWrapper>
        <h3 className="content-heading">
          Payment plan summary
          <small data-localize="dashboard.WELCOME">Selected loan ID: 1234</small>
        </h3>

        <Grid fluid>
          <Row>
            <Col lg={12}>
              { /* Payoff button */ }
              <Row>
                <Col lg={ 3 } sm={ 6 }>
                  <PayOffButton/>
                </Col>
              </Row>

              { /* payment table */ }
              <Panel>
                <Row>
                  <PaymentStatusTabs tabList={tabList} selectedTab={selectedTab} onClickPaymentTab={onClickPaymentTab}/>
                </Row>

                <Row>
                  <PaymentPlanTable paymentList={paymentList} selectedTab={selectedTab}/>
                </Row>
              </Panel>
            </Col>
          </Row>
        </Grid>
      </ContentWrapper>
    )
  }
}
