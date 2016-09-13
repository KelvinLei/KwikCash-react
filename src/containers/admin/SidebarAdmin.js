import React, { Component, PropTypes } from 'react'
import Sidebar from '../../themeJsx/Layout/Sidebar'

export default class SidebarAdmin extends Component {
  render() {
    const { location } = this.props;

    const currentPage = location.pathname.replace('/', '')

    // icons provided by bower_components/simple-line-icons/css/simple-line-icons.css
    const tabList = [
      { tabName: 'Export Loans',
        toLink: '/admin/exportLoans',
        icon: "icon-home",
        className: currentPage.includes("exportLoans") || currentPage === 'admin' ? "active" : ""
      },
      { tabName: 'Export Clients',
        toLink: '/admin/exportClients',
        icon: "icon-note",
        className: currentPage === "exportClients" ? "active" : ""
      },
      { tabName: 'Logout',
        toLink: '/admin/logout',
        icon: "icon-logout",
        className: currentPage === "logout" ? "active" : ""
      }
    ]

    return (
      <aside className='aside'>
        { /* invoke Sidebar from theme pack */ }
        <Sidebar tabList={tabList} onClickSidebarTab={this.props.handleSelectedNavTab}/>
      </aside>
    )
  }
}
