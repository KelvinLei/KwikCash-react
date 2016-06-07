import React, { Component } from 'react'
import {MY_LOAN_PAGE_STATE, PAYMENT_PLAN_PAGE_STATE} from '../shared/Constants'
import { Link } from 'react-router'

export default class MemberNavBar extends Component {
  render() {
    const { loanSummaryClass, paymentInfoClass, onClickNavTab } = this.props;

    function handleOnClick(event) {
      const pageTextToStateMap = {
        'myloan': MY_LOAN_PAGE_STATE,
        'paymentplan': PAYMENT_PLAN_PAGE_STATE
      }

      const selectedTabText = String(event.target.text).toLowerCase().trim().replace(/\s+/g, '');

      const selectedTabStateName = pageTextToStateMap[selectedTabText] || MY_LOAN_PAGE_STATE

      onClickNavTab(selectedTabStateName)
    }

    return (
      <div>
        <ul class="nav nav-pills nav-stacked" >
          <li class={loanSummaryClass} onClick={handleOnClick}>
            <Link to="/myLoan">My Loan</Link>
          </li>

          <li class={paymentInfoClass} onClick={handleOnClick}>
            <Link to="/paymentPlan">Payment Plan</Link>
          </li>

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
