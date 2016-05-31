import React, { Component } from 'react';
import MemberNav from './member/nav/MemberNav';
import TopHeader from './member/header/TopHeader';

export default class App extends Component {
    render() {
        return (
            <div className="container-fluid">
                <div className="col-sm-3">
                    <MemberNav/>
                </div>

                <div className="col-sm-9">
                    <TopHeader/>
                </div>
            </div>
        )
    }
}
