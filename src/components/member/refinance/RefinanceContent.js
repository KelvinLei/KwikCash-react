import React, { Component } from 'react'
import ContentWrapper from '../../../themeJsx/Layout/ContentWrapper';
import { Row, Col, Panel } from 'react-bootstrap';

export default class RefinanceContent extends Component {
  render() {
    const {} = this.props;

    const refinanceValue = [2000, 3000, 4000, 5000];


    return (
      <ContentWrapper>
        { /* header */}
        <div className="content-heading">
          Hello John
          <small data-localize="dashboard.WELCOME">Loan ID: 1234</small>
        </div>

        <Row>
          <Col xs={12} className="text-center">
            <h4>Current balance: $3000.00</h4>
          </Col>
        </Row>

        { /* refinance value and table */}
        <Row>
          <Col md={ 6 }>
            { /* START panel */ }
            <Panel header="Potential refinance value">
              <Row>
                <Col md={ 3 } mdOffset={ 2 }>
                  <div class="input-group">
                    <span class="input-group-addon">
                      <input type="radio" name="refinanceValue"/>
                    </span>
                    <span class="input-group-addon">$2000</span>
                  </div>
                </Col>

                <Col md={ 3 } mdOffset={ 1 }>
                  <div class="input-group">
                    <span class="input-group-addon">
                      <input type="radio" name="refinanceValue"/>
                    </span>
                    <span class="input-group-addon">$3000</span>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={ 3 } mdOffset={ 2 }>
                  <div class="input-group">
                    <span class="input-group-addon">
                      <input type="radio" name="refinanceValue"/>
                    </span>
                    <span class="input-group-addon">$4000</span>
                  </div>
                </Col>

                <Col md={ 3 } mdOffset={ 1 }>
                  <div class="input-group">
                    <span class="input-group-addon">
                      <input type="radio" name="refinanceValue"/>
                    </span>
                    <span class="input-group-addon">$5000</span>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={ 8 } mdOffset={ 1 }>
                  <div class="input-group">
                    <span class="input-group-addon">
                      <input type="radio" name="refinanceValue"/>
                    </span>

                    <span class="input-group-addon">Other: $</span>

                    <input type="text" class="form-control text-right" aria-label="Amount (to the nearest dollar)"/>
                    <span class="input-group-addon">.00</span>
                  </div>
                </Col>
              </Row>
            </Panel>
            { /* END panel */ }
          </Col>

          <Col md={ 6 }>
            { /* START panel */ }
            <Panel header="Estimated new balance">
              second panel
            </Panel>
            { /* END panel */ }
          </Col>
        </Row>
      </ContentWrapper>
    )
  }
}
