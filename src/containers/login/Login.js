import React, { Component, PropTypes } from 'react'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'
import LoginComponent from '../../components/login/login'
import { login } from '../../redux/actions/login'

LoginComponent.propTypes = {
  isAuthenticated: React.PropTypes.bool.isRequired,
  router: React.PropTypes.shape({
    push: React.PropTypes.func.isRequired
  }).isRequired
}
const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.loginState.isAuthenticated,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoginSubmit : (username, password) => dispatch(login(username, password))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LoginComponent))
