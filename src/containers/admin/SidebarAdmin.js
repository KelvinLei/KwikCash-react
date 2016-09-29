import React, { Component, PropTypes } from 'react'
import Sidebar from '../../themeJsx/Layout/Sidebar'

export default class SidebarAdmin extends Component {
  render() {
    const { location } = this.props;

    // replace all occurences of '/' and remove it.
    // javascript doesn't have a replaceAll function
    const currentPage = location.pathname.split('/').join('')

    // icons provided by bower_components/simple-line-icons/css/simple-line-icons.css
    const tabList = [
      { tabName: 'Export Loans',
        toLink: '/admin/exportLoans',
        icon: "icon-home",
        className: currentPage.includes("exportLoans") || currentPage === 'admin' ? "active" : ""
      },
      { tabName: 'Members (development)',
        toLink: '/admin/members',
        icon: "icon-user",
        className: currentPage.includes("adminmembers") ? "active" : ""
      },
      { tabName: 'Logout',
        toLink: '/admin/logout',
        icon: "icon-logout",
        className: currentPage === "adminlogout" ? "active" : ""
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
