import React, { Component } from 'react';
import MemberNav from './member/nav/MemberNav';
import TopHeader from './member/header/TopHeader';
import PageHeader from './member/pageHeader/PageHeader';

export default class App extends Component {
  render() {
    const { location } = this.props;

    return (
      <div className="wrapper">
        <div className="row">
          <div className="col-sm-12">
            <TopHeader/>
          </div>
        </div>

        <div className="row">
          <div className="col-sm-3">
            <MemberNav location={location} />
          </div>

          <div className="col-sm-9">
            <div className="row">
              <PageHeader location={location} />
            </div>
            <div className="row">
              {/* add this */}
              { this.props.children }
            </div>
          </div>
        </div>
      </div>
    )
  }
}
