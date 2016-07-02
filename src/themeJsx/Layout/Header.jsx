import React from 'react';
import pubsub from 'pubsub-js';
import HeaderRun from './Header.run'
import { NavDropdown, MenuItem } from 'react-bootstrap';

class Header extends React.Component {

  componentDidMount() {
    HeaderRun();
  }

  toggleUserblock(e) {
    e.preventDefault();
    pubsub.publish('toggleUserblock');
  }

  render() {
    const currentLog = require('../../styles/img/current_logo_white.png');
    const collapseLogo = require('../../styles/img/collapse_kc_logo.png');

    return (
      <header className="topnavbar-wrapper">
        { /* START Top Navbar */ }
        <nav role="navigation" className="navbar topnavbar">
          { /* START navbar header */ }
          <div className="navbar-header">
            <a href="#/" className="navbar-brand">
              <div className="brand-logo">
                <img src={currentLog} alt="App Logo" className="img-responsive" />
              </div>
              <div className="brand-logo-collapsed">
                <img src={collapseLogo} alt="App Logo" className="img-responsive" />
              </div>
            </a>
          </div>
          { /* END navbar header */ }
          { /* START Nav wrapper */ }
          <div className="nav-wrapper">
            { /* START Left navbar */ }
            <ul className="nav navbar-nav">
              <li>
                { /* Button used to collapse the left sidebar. Only visible on tablet and desktops */ }
                <a href="#" data-trigger-resize="" data-toggle-state="aside-collapsed" className="hidden-xs">
                  <em className="fa fa-navicon"/>
                </a>
                { /* Button to show/hide the sidebar on mobile. Visible on mobile only. */ }
                <a href="#" data-toggle-state="aside-toggled" data-no-persist="true" className="visible-xs sidebar-toggle">
                  <em className="fa fa-navicon"/>
                </a>
              </li>
            </ul>
            { /* END Left navbar */ }

            { /* START Refer friends */ }
            <ul className="nav navbar-nav navbar">
              <NavDropdown eventKey={ 3 } title="Refer friends" id="basic-nav-dropdown" >
                <MenuItem className="animated flipInX" eventKey={4.2}>Refer friends</MenuItem>
              </NavDropdown>
            </ul>

            { /* START my account */ }
            <ul className="nav navbar-nav navbar-right">
              <NavDropdown eventKey={ 4 } title="My account" id="basic-nav-dropdown" >
                <MenuItem className="animated flipInX" eventKey={5.1}>Profile</MenuItem>
                <MenuItem divider />
                <MenuItem className="animated flipInX" eventKey={5.2}>Logout</MenuItem>
              </NavDropdown>
            </ul>
          </div>
          { /* END Nav wrapper */ }
        </nav>
        { /* END Top Navbar */ }
      </header>
    );
  }
}

export default Header;
