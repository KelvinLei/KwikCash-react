import React from 'react'
import ContentWrapper from '../../../themeJsx/Layout/ContentWrapper';
import { Row, Col, Panel, Button } from 'react-bootstrap';
import { Link } from 'react-router';

export const MyProfileContent = ({
  activeLoansCount,
  completeLoansCount,
  name,
  address,
  phone,
  email
}) => {

  const profileIconImg = require('../../../styles/img/profile-icon-400x380.png')

  const visaIcon = require('../../../styles/img/visa-credit-card.png')

  const profileBackgroundStyles = {
    backgroundImage: "url('bg7.jpg')"
  }

  const inlineImageWithText = {
    display: "inline",
    width:  "40px",
    height: "40px"
  }

  return (
    <ContentWrapper unwrap>
      <div className="bg-cover" style={profileBackgroundStyles}>
        <div className="p-xl text-center text-white">
          <img src={profileIconImg} alt="Image" className="img-thumbnail img-circle thumb128" />
          <h3 className="m0">{name}</h3>
          <p>Loan Applicant</p>
        </div>
      </div>

      <div className="text-center bg-gray-dark p-lg mb-xl">
        <div className="row row-table">
          <div className="col-xs-6 br">
            <h3 className="m0">{activeLoansCount}</h3>
            <p className="m0">Active loans</p>
          </div>
          <div className="col-xs-6">
            <h3 className="m0">{completeLoansCount}</h3>
            <p className="m0">Completed loans</p>
          </div>
        </div>
      </div>

      <div className="p-lg">
        <Row>
          <Col md={ 8 } mdOffset={ 2 }>
            { /* START Profile Details */ }
            <Panel header="">
              <form method="get" action="/" className="form-horizontal">
                <fieldset>
                  <legend>Profile details</legend>

                  <div className="form-group">
                    <label className="col-sm-2 control-label">Name</label>
                    <Col sm={ 10 }>
                      <p className="form-control-static">{name}</p>
                    </Col>
                  </div>
                </fieldset>

                <fieldset>
                  <div className="form-group">
                    <label className="col-sm-2 control-label">Address</label>
                    <Col sm={ 10 }>
                      <p className="form-control-static">{address}</p>
                    </Col>
                  </div>
                </fieldset>

                <fieldset>
                  <div className="form-group">
                    <label className="col-sm-2 control-label">Phone number</label>
                    <Col sm={ 10 }>
                      <p className="form-control-static">{phone}</p>
                    </Col>
                  </div>
                </fieldset>

                <fieldset>
                  <div className="form-group">
                    <label className="col-sm-2 control-label">Email</label>
                    <Col sm={ 10 }>
                      <p className="form-control-static">{email}</p>
                    </Col>
                  </div>
                </fieldset>

                <fieldset>
                  <div className="form-group">
                    <label className="col-sm-2 control-label">Update profile?</label>
                    <Col sm={ 10 }>
                      <span className="help-block m-b-none">Please contact us to update your profile</span>
                    </Col>
                  </div>
                </fieldset>

              </form>
            </Panel>
          </Col>
        </Row>

        <Row>
          <Col md={ 6 } mdOffset={3} className="text-center">
            <Panel className="panel-info" header="Referral">
              <p>
                Refer a friend and receive a $200 <img style={inlineImageWithText} src={visaIcon}/> giftcard
              </p>
            </Panel>
          </Col>
        </Row>
        { /* END panel */ }
      </div>
    </ContentWrapper>
  )
}