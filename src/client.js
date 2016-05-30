/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App';

ReactDOM.render(
    <App/>,
    document.getElementById('app')
);