import React from 'react'
import ContentWrapper from '../../../themeJsx/Layout/ContentWrapper';
import {Row, Col, Panel } from 'react-bootstrap';
require('./profile.scss');

export const MyProfileContent = ({
  isFetching,
  isFailed,
  userData,
}) => {

  const profileIconImg = require('../../../styles/img/profile-icon-400x380.png')

  const visaIcon = require('../../../styles/img/visa-credit-card.png')

  const inlineImageWithText = {
    display: "inline",
    width: "40px",
    height: "40px"
  }

  return (
    <ContentWrapper unwrap>
      <div id="profile-bg" className="bg-cover">
        <div className="p-xl text-center text-white">
          <img src={profileIconImg} alt="Image" className="img-thumbnail img-circle thumb128"/>
          <h3 className="m0">{userData.firstName} {userData.lastName}</h3>
        </div>
      </div>

      <div className="text-center bg-gray-dark p-lg mb-xl">
        <div className="row row-table">
          <div className="col-xs-12 br">
            <h3 className="m0">{userData.city}, {userData.state}</h3>
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
                      <p className="form-control-static">{userData.firstName} {userData.lastName}</p>
                    </Col>
                  </div>
                </fieldset>

                <fieldset>
                  <div className="form-group">
                    <label className="col-sm-2 control-label">Phone number</label>
                    <Col sm={ 10 }>
                      <p className="form-control-static">{userData.homePhone}</p>
                    </Col>
                  </div>
                </fieldset>

                <fieldset>
                  <div className="form-group">
                    <label className="col-sm-2 control-label">Email</label>
                    <Col sm={ 10 }>
                      <p className="form-control-static">{userData.username}</p>
                    </Col>
                  </div>
                </fieldset>
              </form>
            </Panel>
          </Col>
        </Row>

        <Row>
          <Col md={ 8 } mdOffset={2} className="text-center">
            <p class="text-primary">
              Need to update your profile? Please contact us to update your profile.
            </p>
          </Col>
        </Row>

        <Row>
          <Col md={ 8 } mdOffset={2} className="text-center">
            <Panel className="panel-info" header="Referral">
              <p>
                Refer a friend and receive a $100 <img style={inlineImageWithText} src={visaIcon}/> giftcard
              </p>
            </Panel>
          </Col>
        </Row>
        { /* END panel */ }
      </div>
    </ContentWrapper>
  )
}
