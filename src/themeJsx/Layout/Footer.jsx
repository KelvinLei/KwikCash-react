import React from 'react';
import { Row, Col, Panel } from 'react-bootstrap';

class Footer extends React.Component {

  render() {
    return (
      <footer>
        <Row>
          <Col md={ 6 }>
            <span>Copyright &copy; 2016 - KwikCash. 9150 Irvine Center Drive Irvine, CA 92618</span>
          </Col>

          <Col md={ 6 }>
            <span>Call us at 1-800-478-6230 or email us at info@Kwikcashonline.com</span>
            </Col>
        </Row>
      </footer>
    );
  }

}

export default Footer;
