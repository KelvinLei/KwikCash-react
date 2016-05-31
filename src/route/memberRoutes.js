import React from 'react'
import { Route, IndexRoute } from 'react-router'

import App from '../containers/App'
import LoanSummary from '../containers/member/loanSummary/LoanSummary'
import PaymentInfo from '../containers/member/paymentInfo/PaymentInfo'

module.exports = (
    <Route path="/" component={App}>
        <IndexRoute component={LoanSummary}/>

        <Route path="/loanSummary" component={LoanSummary}/>

        <Route path="/paymentInfo" component={PaymentInfo}/>
    </Route>
)