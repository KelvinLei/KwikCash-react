import React, { Component } from 'react'
import PaymentStatusTab from './PaymentStatusTab'

export default class PaymentStatusTabs extends Component {
  render() {
    const { tabList, selectedTab, onClickPaymentTab } = this.props;

    var statusTabContent = tabList.map((status, id) => {
      const className = status.toLowerCase().match(selectedTab) ? "active" : "";
      return (
        <PaymentStatusTab key={id} className={className} onClickPaymentTab={onClickPaymentTab} status={status}/>
      )
    });

    return (
      <div>
        <ul class="nav nav-tabs">
          {statusTabContent}
        </ul>
      </div>
    )
  }
}
