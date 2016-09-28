import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import { Router, browserHistory, Route, IndexRoute, Redirect } from 'react-router'
import { Provider } from 'react-redux'
import { getReducersForAdmin } from './redux/reducers'
import configureStore from './redux/store/configureStore'
import initTranslation from './themeJsx/Common/localize';
import initLoadCss from './themeJsx/Common/load-css';
import bootstrap from './styles/bootstrap.scss'
import app from './styles/app.scss'
import theme from './styles/themes/theme-a.scss'
import fontAwesome from './themeJsx/bower_components/fontawesome/css/font-awesome.css'

import App from './containers/App'
import ExportLoans from './containers/admin/ExportLoans'
import MembersAdmin from './containers/admin/MembersAdmin'
import MemberLoans from './containers/admin/MemberLoans'
import Login from './containers/login/Login'
import Logout from './containers/login/Logout'
import { getUser } from './api/adminApiClient'

// Init translation system
initTranslation();
// Init css loader (for themes)
initLoadCss();

let store = configureStore(getReducersForAdmin());

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
    const redirectUrl = location.href
    replace({
      pathname: `/admin/login`,
      query: { redirectUrl: redirectUrl },
      state: { nextPathname: nextState.location.pathname }
    })
    callback()
  })
}

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/admin" component={App} onEnter={requireAuth}>
        {/* Default route*/}
        <IndexRoute component={ExportLoans}/>

        {/* if no loadId is specified, redirect back to loan selection page */}
        <Route path="/admin/exportLoans" component={ExportLoans}/>
        <Route path="/admin/members" component={MembersAdmin}/>
        <Route path="/admin/members/memberLoans/:memberId" component={MemberLoans}/>
      </Route>

      <Route path="/admin/login" component={Login}/>
      <Route path="/admin/logout" component={Logout}/>
    </Router>
  </Provider>,
  document.getElementById('app')
);
