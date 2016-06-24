import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import { Router, browserHistory, Route, IndexRoute } from 'react-router'
import { Provider } from 'react-redux'
import MemberRootReducer from './redux/reducers/member/memberRootReducer'
import configureStore from './redux/store/configureStore'
import initTranslation from './themeJsx/Common/localize';
import initLoadCss from './themeJsx/Common/load-css';
import bootstrap from './styles/bootstrap.scss'
import app from './styles/app.scss'
import theme from './styles/themes/theme-a.scss'
import fontAwesome from './themeJsx/bower_components/fontawesome/css/font-awesome.css'

import App from './containers/App'
import LoanSummary from './containers/member/loanSummary/LoanSummary'
import PaymentInfo from './containers/member/paymentInfo/PaymentInfo'
import Refinance from './containers/member/refinance/Refinance'
import Login from './themeJsx/Pages/Login'

// Init translation system
initTranslation();
// Init css loader (for themes)
initLoadCss();

let store = configureStore(MemberRootReducer, './redux/reducers/member/memberRootReducer');

function requireAuth(nextState, replace) {
  // todo , actually assess auth state
  if (false) {
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
  }
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App}>
        {/* Default route*/}
        <IndexRoute component={LoanSummary} onEnter={requireAuth}/>

        <Route path="myLoan" component={LoanSummary}/>
        <Route path="paymentPlan" component={PaymentInfo}/>
        <Route path="refinance" component={Refinance}/>
      </Route>
      <Route path="login" component={Login}/>
    </Router>
  </Provider>,
  document.getElementById('app')
);
