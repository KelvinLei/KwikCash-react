import React, { Component } from 'react'

export default class PaymentStatusTab extends Component {
  render() {
    const { className, status, onClickPaymentTab } = this.props;

    function handleOnClick(event) {
      onClickPaymentTab(event.target.text)
    }

    return (
      <li class={className} onClick={handleOnClick}>
        <a data-toggle="tab" aria-expanded="true">{status}</a>
      </li>
    )
  }
}
