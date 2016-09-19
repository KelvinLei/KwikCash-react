import React, { Component, PropTypes } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import LoginComponent from '../../components/login/logout'

LoginComponent.propTypes = {
  isAdmin: React.PropTypes.bool.isRequired,
}
const mapStateToProps = (state) => {
  return {
    isAdmin: state.loginState.isAdmin,
  }
}


export default connect(mapStateToProps)(withRouter(LoginComponent))
