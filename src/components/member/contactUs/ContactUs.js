import React from 'react'
import ContentWrapper from '../../../themeJsx/Layout/ContentWrapper';
import { Row, Col, Panel } from 'react-bootstrap';

export const ContactUs = () => {

  const image = require('../../../styles/img/mb-sample.jpg')
  const facebookIcon = require('../../../styles/img/facebook-icon.png')
  const twitterIcon = require('../../../styles/img/twitter-icon.png')
  const linkedinIcon = require('../../../styles/img/linkedin-icon.png')

  return (
    <ContentWrapper>
      <div className="content-heading">
        Contact us
        <small data-localize="dashboard.WELCOME">Let us hear from you</small>
      </div>

      <div className="p-lg">
        <Row>
          <Col md={ 6 }>
            <Panel header="">
              <img src={image} alt="Image" className="img-responsive"/>
            </Panel>

            <Panel header="Benefits">
              Want to be updated on special promotions, financial tips, or our blog posts?
              <br></br><br></br>

              Subscribe to our newsletter today!
              <br></br><br></br>

              Follow us on FaceBook and Twitter and join us for daily financial advice.
              <br></br><br></br>

              We would love to hear about your experience with us, let us know how we did.
            </Panel>
          </Col>

          <Col md={ 6 }>
            { /* START Profile Details */ }
            <Panel header="">
              <form method="get" action="/" className="form-horizontal">
                <fieldset>
                  <legend className="text-center">Contact info</legend>

                  <div className="form-group">
                    <label className="col-sm-2 control-label">Phone</label>
                    <Col sm={ 10 }>
                      <p className="form-control-static">1-800-478-6230</p>
                    </Col>
                  </div>
                </fieldset>

                <fieldset>
                  <div className="form-group">
                    <label className="col-sm-2 control-label">Fax</label>
                    <Col sm={ 10 }>
                      <p className="form-control-static">1-800-478-0930</p>
                    </Col>
                  </div>
                </fieldset>

                <fieldset>
                  <div className="form-group">
                    <label className="col-sm-2 control-label">Email</label>
                    <Col sm={ 10 }>
                      <p className="form-control-static">INFO@KWIKCASHONLINE.COM</p>
                    </Col>
                  </div>
                </fieldset>

                <fieldset>
                  <div className="form-group">
                    <label className="col-sm-2 control-label">Address</label>
                    <Col sm={ 10 }>
                      <p className="form-control-static">
                        Kwikcash
                      </p>
                      <span>
                        9150 IRVINE CENTER DRIVE
                        IRVINE, CA 92618
                      </span>
                    </Col>
                  </div>
                </fieldset>

                <fieldset>
                  <div className="form-group">
                    <label className="col-sm-2 control-label">Office hours</label>
                    <Col sm={ 10 }>
                      <p className="form-control-static">
                        MONDAY – FRIDAY
                      </p>
                      <span>
                        9AM – 5PM
                      </span>
                    </Col>
                  </div>
                </fieldset>

                <fieldset>
                  <div className="form-group">
                    <label className="col-sm-2 control-label">Social media</label>
                    <Col sm={ 1 }>
                      <a href="https://www.facebook.com/KwikCash-Inc-1381150202201595/">
                        <img src={facebookIcon} />
                      </a>
                    </Col>
                    <Col sm={ 1 }>
                      <a href="https://twitter.com/kwikcashInc">
                        <img src={twitterIcon} />
                      </a>
                    </Col>
                    <Col sm={ 1 }>
                      <a href="https://www.linkedin.com/in/kwikcash-inc-dba-benefit-lending-251399117?authType=NAME_SEARCH&authToken=d4OU&locale=en_US&srchid=1663950311468391506964&srchindex=2&srchtotal=18&trk=vsrp_people_res_name&trkInfo=VSRPsearchId%3A1663950311468391506964%2CVSRPtargetId%3A487664413%2CVSRPcmpt%3Aprimary%2CVSRPnm%3Atrue%2CauthType%3ANAME_SEARCH">
                        <img src={linkedinIcon}  />
                      </a>
                    </Col>
                  </div>
                </fieldset>

              </form>
            </Panel>
          </Col>
        </Row>
        { /* END panel */ }
      </div>
    </ContentWrapper>
  )
}