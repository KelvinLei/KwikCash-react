import React from 'react';
import { Panel, Row, Col } from 'react-bootstrap';

/*
 Renders error messagings
 */
export const FailureWidget = () => (
  <Panel className="panel-default" header="Error">
    <Row>
      <Col md={ 12 }>
        Sorry, we failed to retrieve your data. Please refresh the page and try again. Feel free to contact us.
      </Col>
    </Row>
  </Panel>
)