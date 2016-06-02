import React from 'react'
import { Route, IndexRoute } from 'react-router'

import App from '../containers/App'
import LoanSummary from '../containers/member/loanSummary/LoanSummary'
import PaymentInfo from '../containers/member/paymentInfo/PaymentInfo'

module.exports = (
    <Route path="/" component={App}>
        <IndexRoute component={LoanSummary}/>

        <Route path="/myLoan" name="myloan" component={LoanSummary}/>

        <Route path="/paymentPlan" name="paymentplan" component={PaymentInfo}/>
    </Route>
)