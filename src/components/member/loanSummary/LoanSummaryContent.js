import React, { Component } from 'react'

export default class LoanSummaryContent extends Component {
  render() {
    const {} = this.props;

    return (
      <div>
        <h3>Hello John,</h3>
        <h4>Current balance: $3333.33</h4>
        <h5>Next payment: June 12, 2016</h5>
        <button type="button" class="btn btn-info">Refinance</button>
      </div>
    )
  }
}
