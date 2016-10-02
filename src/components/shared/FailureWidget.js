import React from 'react';
import { Panel, Row, Col } from 'react-bootstrap';

/*
 Renders error messagings
 */
export const FailureWidget = () => (
  <Panel className="panel-default" header="Error">
    <Row>
      <Col md={ 12 }>
        Sorry, we failed to retrieve your data. Please try again or contact us.
      </Col>
    </Row>
  </Panel>
)