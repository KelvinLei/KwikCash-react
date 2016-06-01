import React, { Component } from 'react';
import MemberNav from './member/nav/MemberNav';
import TopHeader from './member/header/TopHeader';

export default class App extends Component {
  render() {
    const { location } = this.props;

    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-3">
            <MemberNav location={location} />
          </div>
  
          <div className="col-sm-9">
            <TopHeader/>
  
            {/* add this */}
            { this.props.children }
          </div>
        </div>
      </div>
    )
  }
}
