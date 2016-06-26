import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import LoginComponent from '../../components/login/login'

LoginComponent.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
}
const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.isAuthenticated,
  }
}

export default connect(mapStateToProps)(LoginComponent)
