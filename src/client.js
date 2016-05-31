import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import MemberRoutes from './route/memberRoutes'
import { Router, browserHistory } from 'react-router';

ReactDOM.render(
    <Router routes={MemberRoutes} history={browserHistory}/>,
    document.getElementById('app')
);