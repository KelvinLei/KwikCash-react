import React from 'react'
import { Route, IndexRoute } from 'react-router'

import App from '../containers/App'
import LoanSummary from '../containers/member/loanSummary/LoanSummary'
import PaymentInfo from '../containers/member/paymentInfo/PaymentInfo'
import Refinance from '../containers/member/refinance/Refinance'

// <Route path="/" component={App}>
//   <IndexRoute component={LoanSummary}/>
//
//   <Route path="/myLoan" name="myloan" component={LoanSummary}/>
//
//   <Route path="/paymentPlan" name="paymentplan" component={PaymentInfo}/>

// <Route path="paymentPlan" component={SingleView}/>
//   <Route path="myProfile" component={SingleView}/>
//   <Route path="logout" component={SingleView}/>
// </Route>

module.exports = (
    <Route path="/" component={App}>
      {/* Default route*/}
      <IndexRoute component={LoanSummary} />

      <Route path="myLoan" component={LoanSummary}/>
      <Route path="paymentPlan" component={PaymentInfo}/>
      <Route path="refinance" component={Refinance}/>

    </Route>
)