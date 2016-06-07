import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import MemberRoutes from './route/memberRoutes'
import { Router, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import MemberRootReducer from './redux/reducers/member/memberRootReducer'
import configureStore from './redux/store/configureStore'
import initTranslation from './themeJsx/Common/localize';
import initLoadCss from './themeJsx/Common/load-css';
import bootstrap from './styles/bootstrap.scss'
import app from './styles/app.scss'
import theme from './styles/themes/theme-a.scss'
import fontAwesome from './themeJsx/bower_components/fontawesome/css/font-awesome.css'

// Init translation system
initTranslation();
// Init css loader (for themes)
initLoadCss();

let store = configureStore(MemberRootReducer, './redux/reducers/member/memberRootReducer');

ReactDOM.render(
  <Provider store={store}>
    <Router routes={MemberRoutes} history={browserHistory}/>
  </Provider>,
  document.getElementById('app')
);
