import React from 'react';
import { Row, Col, Panel } from 'react-bootstrap';

class Footer extends React.Component {

  render() {
    return (
      <footer>
        <Row>
          <Col md={ 4 }>
            <span>Copyright &copy; 2016 - KwikCash </span>
          </Col>

          <Col md={ 8 }>
            <Row>
              <Col md={ 12 }>
                <span>Address: 9150 Irvine Center Drive Irvine, CA 92618</span>
              </Col>
            </Row>
            <Row>
              <Col md={ 12 }>
                <span>Phone: 1-800-478-6230. Email: info@Kwikcashonline.com</span>
              </Col>
            </Row>
          </Col>
        </Row>
      </footer>
    );
  }

}

export default Footer;
