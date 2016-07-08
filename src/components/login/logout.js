import React from 'react';
import { logout } from '../../api'

export default class Logout extends React.Component {

  componentWillMount() {
    logout()
    window.location = "http://kwikcashonline.com"
  }

  // intentionally blank
  render() {
    return null
  }
};

