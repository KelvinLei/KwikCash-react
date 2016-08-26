import React from 'react';
import { Grid, Row, Col, Panel, Button } from 'react-bootstrap'
import ErrorMessage from './loginErrorMessage'
import {sendCounterMetrics, METRICS_NAME_MEMBER_LOGIN_SUCCESS} from "../../api/index";

require('./login.scss');
const logo = require('../../styles/img/current_logo_white.png');

export default class Login extends React.Component {

  componentWillReceiveProps(nextProps) {
    const { isAuthenticated, router, location } = nextProps

    const redirectUrl = location.query.redirectUrl || '/'

    if (isAuthenticated) {
      sendCounterMetrics(METRICS_NAME_MEMBER_LOGIN_SUCCESS, [])
      router.push(redirectUrl)
    }
  }

  render() {
    let username;
    let password;

    return (
      <div className="block-center mt-xl wd-xl">
        { /* START panel */ }
        <div className="panel panel-dark panel-flat">
          <div className="panel-heading text-center">
            <a href="#">
              <img src={logo} alt="Image" className="block-center" />
            </a>
          </div>
          <div className="panel-body">
            <p className="text-center pv">SIGN IN TO CONTINUE.</p>
            <form role="form"
                  data-parsley-validate=""
                  noValidate
                  className="mb-lg"
                  onSubmit={ e => {
              e.preventDefault();
              this.props.onLoginSubmit(username.value, password.value);
            }}>
              <div className="form-group has-feedback">
                <input id="inputEmail"
                       type="email"
                       placeholder="Enter email"
                       autoComplete="on"
                       required="required"
                       className={ "form-control " + (this.props.loginFailed ? 'parsley-error' : '') }
                       ref = { e => username = e }/>
                <span className="fa fa-envelope form-control-feedback text-muted"></span>
              </div>
              <div className="form-group has-feedback">
                <input id="inputPassword"
                       type="password"
                       placeholder="Password"
                       required="required"
                       className={ "form-control " + (this.props.loginFailed ? 'parsley-error' : '') }
                       ref = { p => password = p} />
                <span className="fa fa-lock form-control-feedback text-muted"></span>
                {(() => {
                  return this.props.loginFailed ? <ErrorMessage/> : ''
                })()}
              </div>
              <div className="clearfix">
                <div className="checkbox c-checkbox pull-left mt0">
                  <label>
                    <input type="checkbox" value="" name="remember" />
                    <em className="fa fa-check"></em>Remember Me</label>
                </div>
                {/*
                 <div className="pull-right">
                 <a href="/recover" className="text-muted">Forgot your password?</a>
                 </div>
                */
                }
              </div>
              <button type="submit" className="btn btn-block btn-primary mt-lg">
                Login
              </button>
            </form>
            <p className="pt-lg text-center">
              Need to Signup?<br/>
              Please contact our office at 1-800-478-6230
            </p>
            {/*
             <a href="register" className="btn btn-block btn-default">
             Register Now
             </a>
              */
            }
          </div>
        </div>
        { /* END panel */ }
      </div>
    )
  }
};

