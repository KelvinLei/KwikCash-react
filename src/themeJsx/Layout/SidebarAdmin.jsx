import React from 'react';
import { Link } from 'react-router';
import pubsub from 'pubsub-js';
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
    this.props.onClickSidebarTab(selectedTab.replace('/', ''))
  }

  render() {
    const { tabList, statsReportsTabList, moreTabList } = this.props

    var displayTabs = tabList.map((tabData, id) => {
      return (
        <li key={id} className={tabData.className}>
          <Link to={tabData.toLink} title={tabData.tabName} data-stateValue={tabData.toLink} >
            <em className={tabData.icon}/>
            <span data-localize="sidebar.nav.SINGLEVIEW">{tabData.tabName}</span>
          </Link>
        </li>
      )
    })

    var displayStatsReportsTabList = statsReportsTabList.map((tabData, id) => {
      return (
        <li key={id} className={tabData.className}>
          <Link to={tabData.toLink} title={tabData.tabName} data-stateValue={tabData.toLink} >
            <em className={tabData.icon}/>
            <span data-localize="sidebar.nav.SINGLEVIEW">{tabData.tabName}</span>
          </Link>
        </li>
      )
    })

    var displayMoreTabList = moreTabList.map((tabData, id) => {
      return (
        <li key={id} className={tabData.className}>
          <Link to={tabData.toLink} title={tabData.tabName} data-stateValue={tabData.toLink} >
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
              <span data-localize="sidebar.heading.HEADER">Operations</span>
            </li>
            { displayTabs }

            <li className="nav-heading ">
              <span data-localize="sidebar.heading.HEADER">Stats Reports</span>
            </li>
            { displayStatsReportsTabList }

            <li className="nav-heading ">
              <span data-localize="sidebar.heading.HEADER">More</span>
            </li>
            { displayMoreTabList }
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
