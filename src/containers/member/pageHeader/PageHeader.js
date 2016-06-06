import React, { Component } from 'react'
import { IndexLink, Link } from 'react-router'

export default class PageHeader extends Component {
  render() {
    const { location } = this.props;
    const loanSummaryClass = location.pathname.match(/^\/myLoan/) ? "active" : "";
    const paymentInfoClass = location.pathname.match(/^\/paymentPlan/) ? "active" : "";

    return (
      <div className="content-heading page-header">
        <h2>Page title</h2>
        <small data-localize="dashboard.WELCOME">sub-title</small>
      </div>
    )
  }
}
