import React from 'react'
import { Route, IndexRoute } from 'react-router'


import Base from '../themeJsx/Layout/Base';
import BasePage from '../themeJsx/Layout/BasePage';
import BaseHorizontal from '../themeJsx/Layout/BaseHorizontal';

import SingleView from '../themeJsx/SingleView/SingleView';

import App from '../containers/App'
import LoanSummary from '../containers/member/loanSummary/LoanSummary'
import PaymentInfo from '../containers/member/paymentInfo/PaymentInfo'

// <Route path="/" component={App}>
//   <IndexRoute component={LoanSummary}/>
//
//   <Route path="/myLoan" name="myloan" component={LoanSummary}/>
//
//   <Route path="/paymentPlan" name="paymentplan" component={PaymentInfo}/>
// </Route>

module.exports = (
    <Route path="/" component={Base}>
      {/* Default route*/}
      <IndexRoute component={SingleView} />

      <Route path="singleview" component={SingleView}/>
    </Route>
)