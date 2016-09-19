import React from 'react';
import { adminLogout } from '../../api/admin'
import { logout } from '../../api'

export default class Logout extends React.Component {

  componentWillMount() {
    this.props.isAdmin ? adminLogout() : logout()
    const logoutUrl = this.props.isAdmin ? '/admin' : "http://kwikcashonline.com"
    window.location = logoutUrl
  }

  // intentionally blank
  render() {
    return null
  }
};

