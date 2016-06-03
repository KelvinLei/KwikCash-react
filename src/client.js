import 'babel-polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import MemberRoutes from './route/memberRoutes'
import { Router, browserHistory } from 'react-router'
import { Provider } from 'react-redux'
import MemberRootReducer from './redux/reducers/member/memberRootReducer'
import configureStore from './redux/storeCreator'

let store = configureStore(MemberRootReducer, './redux/reducers/member/memberRootReducer');

ReactDOM.render(
  <Provider store={store}>
    <Router routes={MemberRoutes} history={browserHistory}/>
  </Provider>,
  document.getElementById('app')
);