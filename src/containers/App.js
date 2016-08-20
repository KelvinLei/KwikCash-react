import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Footer from '../themeJsx/Layout/Footer'

import SidebarContainer from './member/sidebar/SidebarContainer';
import TopHeader from './member/header/TopHeader';
import {sendCounterMetrics, METRICS_NAME_PROMO_CODE} from "../api/index";

/*
 This is a clone version of Base.jsx in themeJsx.

 Animations supported
   'rag-fadeIn'
   'rag-fadeInUp'
   'rag-fadeInDown'
   'rag-fadeInRight'
   'rag-fadeInLeft'
   'rag-fadeInUpBig'
   'rag-fadeInDownBig'
   'rag-fadeInRightBig'
   'rag-fadeInLeftBig'
   'rag-zoomBackDown'
 */
export default class App extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { location } = this.props

    const promoCode = location.query.promoCode
    promoCode && sendCounterMetrics(METRICS_NAME_PROMO_CODE, promoCode)
  }

  render() {
    const { location } = this.props;

    const animationName = 'rag-fadeInRight'

    return (
      <div className="wrapper">
        <TopHeader />

        <SidebarContainer location={location}/>

        <ReactCSSTransitionGroup
          component="section"
          transitionName={animationName}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
          {this.props.children}
        </ReactCSSTransitionGroup>

        <Footer />
      </div>
    )
  }
}
