import React, { Component } from 'react'
import { IndexLink, Link } from 'react-router'
import styles from './MemberNavStyle.scss'

export default class MemberNav extends Component {
  render() {
    const { location } = this.props;
    const loanSummaryClass = location.pathname.match(/^\/myLoan/) ? "active" : "";
    const paymentInfoClass = location.pathname.match(/^\/paymentPlan/) ? "active" : "";

    return (
      <div>
        <ul class="nav nav-pills nav-stacked" >
          <li class={loanSummaryClass}><Link to="/myLoan">My Loan</Link></li>

          <li class={paymentInfoClass}><Link to="/paymentPlan">Payment Plan</Link></li>

          <li><a href="#">Re-finance></a></li>

          <li><a href="#">Log Out</a></li>

          <li class="dropdown">
            <a class="dropdown-toggle" data-toggle="dropdown" href="#" aria-expanded="false">
              Dropdown <span class="caret"/>
            </a>
              <ul class="dropdown-menu">
                  <li><a href="#">Action</a></li>
                  <li><a href="#">Another action</a></li>
                  <li><a href="#">Something else here</a></li>
                  <li class="divider"/>
                  <li><a href="#">Separated link</a></li>
              </ul>
          </li>
        </ul>
      </div>
    )
  }
}
