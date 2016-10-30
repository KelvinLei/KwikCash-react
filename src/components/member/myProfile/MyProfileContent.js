import React, { Component } from 'react'
import ContentWrapper from '../../../themeJsx/Layout/ContentWrapper';
import {Row, Col, Panel, Button, Alert } from 'react-bootstrap';
import runParsley from './runParsley'
require('./profile.scss');
require('../shared/parsley.scss');
require('parsleyjs/dist/parsley.min.js')


export default class MyProfileContent extends Component {

  componentDidMount() {
    runParsley()
  }

  render() {
    const {
      isFetching,
      isFailed,
      userData,
      changePasswordState,
      changePasswordOnclick
    } = this.props

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
              <ProfileSection   firstName={userData.firstName}
                                lastName={userData.lastName}
                                phone={userData.homePhone}
                                userName={userData.username}
              />
            </Col>
          </Row>

          <Row>
            <Col md={ 8 } mdOffset={ 2 }>
              <ChangePasswordSection changePasswordState={changePasswordState}
                                     changePasswordOnclick={changePasswordOnclick}
              />
            </Col>
          </Row>

          <Row>
            <Col md={ 8 } mdOffset={2} className="text-center">
              <p class="text-primary">
                <a href="https://www.kwikcashonline.com/contact-us/">Need to update your profile? Please contact us to
                  update your profile.</a>
              </p>
            </Col>
          </Row>

          <Row>
            <Col md={ 8 } mdOffset={2} className="text-center">
              <Panel className="panel-info" header=" ">
                <p>
                  Refer a friend and receive a $100 <img style={inlineImageWithText} src={visaIcon}/> giftcard
                </p>
              </Panel>
            </Col>
          </Row>
        </div>
      </ContentWrapper>
    )
  }
}

const ProfileSection = ({
  firstName,
  lastName,
  phone,
  userName,
}) => {
  return (
    <Panel className="panel-info" header="">
      <form method="get" action="/" className="form-horizontal">
        <fieldset>
          <legend>Profile details</legend>

          <div className="form-group">
            <label className="col-md-2 control-label">Name</label>
            <Col md={ 10 }>
              <p className="form-control-static">{firstName} {lastName}</p>
            </Col>
          </div>
        </fieldset>

        <fieldset>
          <div className="form-group">
            <label className="col-md-2 control-label">Phone number</label>
            <Col md={ 10 }>
              <p className="form-control-static">{phone}</p>
            </Col>
          </div>
        </fieldset>

        <fieldset>
          <div className="form-group">
            <label className="col-md-2 control-label">Email</label>
            <Col md={ 10 }>
              <p className="form-control-static">{userName}</p>
            </Col>
          </div>
        </fieldset>
      </form>
    </Panel>
  )
}

const ChangePasswordSection = ({
  changePasswordState,
  changePasswordOnclick
}) => {

  const changePassword = (e) => {
    e.preventDefault()
    if (!$('form[data-parsley-validate]').parsley().isValid()) return false

    const currentPassword = $('#currentPasswordInput').val()
    const newPassword = $('#newPasswordInput').val()
    changePasswordOnclick(currentPassword, newPassword)
  }

  return (
    <Panel className="panel-info" header="">
      <form onSubmit={changePassword.bind(this)} data-parsley-validate="" className="form-horizontal">
        <legend>Change password</legend>

        <fieldset>
          <div className="form-group">
            <label className="col-md-3 control-label">Current password</label>
            <Col md={ 9 }>
              <input type="password" id="currentPasswordInput"
                     data-parsley-required="true"
                     className="form-control"/>

              {
                changePasswordState.incorrectCurrPassword &&
                <Alert bsStyle="danger">
                  Incorrect current password
                </Alert>
              }
            </Col>
          </div>
        </fieldset>

        <fieldset>
          <div className="form-group">
            <label className="col-md-3 control-label">New password</label>
            <Col md={ 9 }>
              <input type="password" id="newPasswordInput" className="form-control"
                     data-parsley-required="true"
              />
            </Col>
          </div>
        </fieldset>

        <fieldset>
          <div className="form-group">
            <label className="col-md-3 control-label">Re-type password</label>
            <Col md={ 9 }>
              <input type="password" id="retypeNewPasswordInput" className="form-control"
                     data-parsley-required="true"
                     data-parsley-equalto="#newPasswordInput"
                     data-parsley-error-message="Not matching with new password"
              />
            </Col>
          </div>
        </fieldset>

        <div className="panel-footer text-center">
          {
            changePasswordState.isFetching &&
            <div>Loading</div>
          }
          {
            !changePasswordState.isFetching &&
            <Button type="submit" bsClass="btn btn-info" className="mb-sm">Change password</Button>
          }
          {
            changePasswordState.success &&
            <Alert bsStyle="success">
              Password updated
            </Alert>
          }
          {
            changePasswordState.isFailed &&
            <Alert bsStyle="danger">
              Failed to update password. Please refresh and try again.
            </Alert>
          }
        </div>
      </form>
    </Panel>
  )
}
