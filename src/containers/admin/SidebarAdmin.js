import React, { Component, PropTypes } from 'react'
import Sidebar from '../../themeJsx/Layout/SidebarAdmin'

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
      { tabName: 'Export Analytics',
        toLink: '/admin/exportAnalytics',
        icon: "icon-book-open",
        className: currentPage.includes("exportAnalytics") ? "active" : ""
      },
      { tabName: 'Members',
        toLink: '/admin/members',
        icon: "icon-user",
        className: currentPage.includes("adminmembers") ? "active" : ""
      }
    ]

    const statsReportsTabList = [
      { tabName: 'Loan Stats Report',
        toLink: '/admin/loanStatsReport',
        icon: "icon-chart",
        className: currentPage.includes("loanStatsReport") ? "active" : ""
      },
      { tabName: 'A/R Report',
        toLink: '/admin/arReport',
        icon: "icon-graph",
        className: currentPage.includes("arReport") ? "active" : ""
      }
    ]

    const moreTabList = [
      { tabName: 'Logout',
        toLink: '/admin/logout',
        icon: "icon-logout",
        className: currentPage === "adminlogout" ? "active" : ""
      }
    ]

    return (
      <aside className='aside'>
        { /* invoke Sidebar from theme pack */ }
        <Sidebar tabList={tabList}
                 statsReportsTabList={statsReportsTabList}
                 moreTabList={moreTabList}
                 onClickSidebarTab={this.props.handleSelectedNavTab}
        />
      </aside>
    )
  }
}
