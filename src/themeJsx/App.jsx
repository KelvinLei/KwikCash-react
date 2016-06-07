/*!
 *
 * Angle - Bootstrap Admin App + ReactJS
 *
 * Version: 3.3.1
 * Author: @themicon_co
 * Website: http://themicon.co
 * License: https://wrapbootstrap.com/help/licenses
 *
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, hashHistory, browserHistory, IndexRoute } from 'react-router';

import initTranslation from './Common/localize';
import initLoadCss from './Common/load-css';

import Base from './Layout/Base';
import BasePage from './Layout/BasePage';
import BaseHorizontal from './Layout/BaseHorizontal';

import SingleView from './SingleView/SingleView';
import SubMenu from './SubMenu/SubMenu';

import bootstrap from '../styles/bootstrap.scss'
import app from '../styles/app.scss'
import theme from '../styles/themes/theme-a.scss'
import fontAwesome from '../themeJsx/bower_components/fontawesome/css/font-awesome.css'

// Init translation system
initTranslation();
// Init css loader (for themes)
initLoadCss();

ReactDOM.render(
  <Router history={browserHistory}>

    <Route path="/" component={Base}>

      {/* Default route*/}
      <IndexRoute component={SingleView} />

      <Route path="singleview" component={SingleView}/>
      <Route path="submenu" component={SubMenu}/>

    </Route>

    {/* Not found handler */}
    {/*<Route path="*" component={NotFound}/>*/}

  </Router>,
  document.getElementById('app')
);
