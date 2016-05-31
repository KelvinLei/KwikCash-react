import React, { Component } from 'react'

export default class MemberNav extends Component {
    render() {
        return (
            <div>
                <ul className="nav nav-pills nav-stacked">
                    <li><a href="#">Brand Image</a></li>
                    <li className="active"><a href="#">Loan Summary</a></li>
                    <li><a href="#">Payment Select</a></li>
                    <li><a href="#">Re-finance</a></li>
                    <li><a href="#">Log Out</a></li>
                    <li className="disabled"><a href="#">Disabled</a></li>
                    <li className="dropdown">
                        <a className="dropdown-toggle" data-toggle="dropdown" href="#" aria-expanded="false">
                            Dropdown <span className="caret"/>
                        </a>
                        <ul className="dropdown-menu">
                            <li><a href="#">Action</a></li>
                            <li><a href="#">Another action</a></li>
                            <li><a href="#">Something else here</a></li>
                            <li className="divider"/>
                            <li><a href="#">Separated link</a></li>
                        </ul>
                    </li>
                </ul>

                {/* add this */}
                {/* this.props.children*/}
            </div>
        )
    }
}
