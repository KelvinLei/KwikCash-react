import React, { Component } from 'react'

export default class PaymentStatusTab extends Component {
  render() {
    const { className, status, onClick } = this.props;

    function handleOnClick(event) {
      onClick(event.target.value)
    }

    return (
      <li class={className} onClick={this.handleOnClick}>
        <a data-toggle="tab" aria-expanded="true">{status}</a>
      </li>
    )
  }
}
