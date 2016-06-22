import React from 'react';
import { Link } from 'react-router';
import pubsub from 'pubsub-js';
import {MY_LOAN_PAGE_STATE, PAYMENT_PLAN_PAGE_STATE, REFINANCE_PAGE_STATE, MY_PROFILE_PAGE_STATE, LOGOUT_PAGE_STATE}
  from "../../components/member/shared/Constants"
import SidebarRun from './Sidebar.run';
import singleLineIcons from '../bower_components/simple-line-icons/css/simple-line-icons.css'

class Sidebar extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      userBlockCollapse: false,
      collapse: {
        singleview: this.routeActive(['singleview']),
        submenu: this.routeActive(['submenu'])
      }
    };
    this.pubsub_token = pubsub.subscribe('toggleUserblock', () => {
      this.setState({
        userBlockCollapse: !this.state.userBlockCollapse
      });
    });
  };

  componentDidMount() {
    SidebarRun();
  }

  componentWillUnmount() {
    // React removed me from the DOM, I have to unsubscribe from the pubsub using my token
    pubsub.unsubscribe(this.pubsub_token);
  }

  routeActive(paths) {
    paths = Array.isArray(paths) ? paths : [paths];
    for (let p in paths) {
      if (this.context.router.isActive(paths[p]) === true)
        return true;
    }
    return false;
  }

  handleOnClick(selectedTab) {
    this.props.onClickSidebarTab(selectedTab)
  }

  render() {
    const { tabList, onClickSidebarTab } = this.props

    var displayTabs = tabList.map((tabData, id) => {
      return (
        <li key={id} className={tabData.className}>
          <Link to={tabData.toLink} title={tabData.tabName} data-stateValue={tabData.toLink} onClick={this.handleOnClick.bind(this, tabData.toLink)}>
            <em className={tabData.icon}/>
            <span data-localize="sidebar.nav.SINGLEVIEW">{tabData.tabName}</span>
          </Link>
        </li>
      )
    })

    return (
      <div className="aside-inner">
        <nav data-sidebar-anyclick-close="" className="sidebar">
          <ul className="nav">
            <li className="nav-heading ">
              <span data-localize="sidebar.heading.HEADER">Main Navigation</span>
            </li>

            { /* render tabs */ }
            {displayTabs}
          </ul>
        </nav>
      </div>
    );
  }
}

Sidebar.contextTypes = {
  router: () => {
    return React.PropTypes.func.isRequired;
  }
};

export default Sidebar;
