import React, { Component } from 'react';
import MemberNav from './member/nav/MemberNav';
import TopHeader from './member/header/TopHeader';
import PageHeader from './member/pageHeader/PageHeader';

export default class App extends Component {
  render() {
    const { location } = this.props;

    return (
      <div className="wrapper">
          <div className="topnavbar-wrapper">
            <TopHeader/>
          </div>

          <MemberNav/>

          <div className="col-sm-8">
            <div className="row">
              <PageHeader/>
            </div>
            <div className="row">
              {/* add this */}
              { this.props.children }
            </div>
          </div>
      </div>
    )
  }
}
