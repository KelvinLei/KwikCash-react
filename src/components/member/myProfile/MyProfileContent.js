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

  var profileBackgroundStyles = {
    backgroundImage: "url('bg7.jpg')"
  };

  return (
    <ContentWrapper unwrap>
      <div className="bg-cover" style={profileBackgroundStyles}>
        <div className="p-xl text-center text-white">
          <img src={profileIconImg} alt="Image" className="img-thumbnail img-circle thumb128" />
          <h3 className="m0">Ted Berry</h3>
          <p>Lead director</p>
        </div>
      </div>

      <div className="text-center bg-gray-dark p-lg mb-xl">
        <div className="row row-table">
          <div className="col-xs-4 br">
            <h3 className="m0">400</h3>
            <p className="m0">
              <span className="hidden-xs">Profile</span>
              <span>Views</span>
            </p>
          </div>
          <div className="col-xs-4 br">
            <h3 className="m0">2000</h3>
            <p className="m0">Likes</p>
          </div>
          <div className="col-xs-4">
            <h3 className="m0">100</h3>
            <p className="m0">Following</p>
          </div>
        </div>
      </div>

    </ContentWrapper>
  )
}