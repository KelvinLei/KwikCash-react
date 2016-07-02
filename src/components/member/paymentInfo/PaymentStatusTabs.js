import React from 'react'

export const PaymentStatusTabs = ({tabList, selectedTab, onClickPaymentTab}) => {
  var statusTabContent = tabList.map((status, id) => {
    const className = status.toLowerCase() === String(selectedTab).toLowerCase() ? "active" : "";
    return (
      <PaymentStatusTab key={id} className={className} onClickPaymentTab={onClickPaymentTab} status={status}/>
    )
  });

  return (
    <div>
      <ul class="nav nav-tabs nav-justified">
        {statusTabContent}
      </ul>
    </div>
  )
}

const PaymentStatusTab = ({className, status, onClickPaymentTab }) => {
  const handleOnClick = (event) => {
    onClickPaymentTab(event.target.text)
  }

  return (
    <li class={className} onClick={handleOnClick}>
      <a data-toggle="tab" aria-expanded="true">{status}</a>
    </li>
  )
}