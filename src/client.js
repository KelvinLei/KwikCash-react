import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import { Router, browserHistory, Route, IndexRoute } from 'react-router'
import { Provider } from 'react-redux'
import RootReducer from './redux/reducers'
import configureStore from './redux/store/configureStore'
import initTranslation from './themeJsx/Common/localize';
import initLoadCss from './themeJsx/Common/load-css';
import bootstrap from './styles/bootstrap.scss'
import app from './styles/app.scss'
import theme from './styles/themes/theme-a.scss'
import fontAwesome from './themeJsx/bower_components/fontawesome/css/font-awesome.css'

import App from './containers/App'
import LoanSelection from './containers/member/loanSelection/LoanSelection'
import LoanSummary from './containers/member/loanSummary/LoanSummary'
import LoanSummaryOld from './containers/member/loanSummary/LoanSummaryOld'
import PaymentInfo from './containers/member/paymentInfo/PaymentInfo'
import Refinance from './containers/member/refinance/Refinance'
import Login from './containers/login/Login'
import { getUser } from './api'

// Init translation system
initTranslation();
// Init css loader (for themes)
initLoadCss();

let store = configureStore(RootReducer);

const ENABLE_AUTH = true;
const requireAuth = (nextState, replace, callback) => {
  if (!ENABLE_AUTH) {
    callback();
    return;
  }
  getUser().then((data) => {
    const user = data.user;
    if (!user || !user.id) {
      throw new Error('user not valid');
    }
    callback();
  }).catch(() => {
    // redirect to login page when the user isnt authenticated
    replace({
      pathname: '/login',
      state: { nextPathname: nextState.location.pathname }
    })
    callback()
  })
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={App} onEnter={requireAuth}>
        {/* Default route*/}
        <IndexRoute component={LoanSelection}/>

        <Route path="/myLoans" component={LoanSelection}/>
        {/* if no loadId is specified, redirect back to loan selection page */}
        <Route path="/loanSummary" component={LoanSelection}/>
        <Route path="/loanSummary/:loanId" component={LoanSummary}/>


        <Route path="/myLoan" component={LoanSummaryOld}/>
        <Route path="/paymentPlan" component={PaymentInfo}/>
        <Route path="/refinance" component={Refinance}/>
      </Route>
      <Route path="/login" component={Login}/>
    </Router>
  </Provider>,
  document.getElementById('app')
);
