import React, { Component } from 'react'
import {MY_LOAN_PAGE_STATE, PAYMENT_PLAN_PAGE_STATE} from '../shared/Constants'

export default class PageHeaderComp extends Component {
  render() {
    const { selectedPage } = this.props;

    var pageToHeaderMap = {}
    pageToHeaderMap[MY_LOAN_PAGE_STATE] = "My Loan Summary"
    pageToHeaderMap[PAYMENT_PLAN_PAGE_STATE] = "Payment Plan Info"

    const header = pageToHeaderMap[selectedPage] || pageToHeaderMap[MY_LOAN_PAGE_STATE]

    return (
      <div className="content-heading page-header">
        <h2>{header}</h2>
        <small data-localize="dashboard.WELCOME">Loan ID: 1234</small>
      </div>
    )
  }
}
