import React, { Component } from 'react'
import { IndexLink, Link } from 'react-router'
import styles from './MemberNavStyle.scss'

export default class MemberNav extends Component {
    render() {

        return (
            <div>
                <ul className="nav nav-pills nav-stacked" >
                    <li><a href="#">Brand Image</a></li>

                    <li><Link to="/loanSummary" activeClassName="active">Loan Summary</Link></li>

                    <li><Link to="/paymentInfo" activeClassName="active">Payment Info</Link></li>

                    <li><a href="#">Re-finance></a></li>

                    <li><a href="#">Log Out</a></li>

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
            </div>
        )
    }
}
