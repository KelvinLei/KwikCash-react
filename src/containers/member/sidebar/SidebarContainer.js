import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Sidebar from '../../../themeJsx/Layout/Sidebar'
import { MY_PROFILE_PAGE_STATE, LOGOUT_PAGE_STATE, MY_LOANS_PAGE_STATE }
  from "../../../components/member/shared/Constants"

class SidebarContainer extends Component {
  render() {
    const { location } = this.props;

    const currentPage = location.pathname.replace('/', '')

    // icons provided by bower_components/simple-line-icons/css/simple-line-icons.css
    const tabList = [
      {tabName: 'My Loans',     toLink: '/' + MY_LOANS_PAGE_STATE,      icon: "icon-home",    className: currentPage.includes(MY_LOANS_PAGE_STATE) || currentPage === '' ? "active" : ""},
      {tabName: 'My Profile',   toLink: '/' + MY_PROFILE_PAGE_STATE,    icon: "icon-user",    className: currentPage === MY_PROFILE_PAGE_STATE ? "active" : ""},
      {tabName: 'Logout',       toLink: '/' + LOGOUT_PAGE_STATE,        icon: "icon-logout",  className: currentPage === LOGOUT_PAGE_STATE ? "active" : ""}
    ]

    return (
      <aside className='aside'>
        { /* invoke Sidebar from theme pack */ }
        <Sidebar tabList={tabList} onClickSidebarTab={this.props.handleSelectedNavTab}/>
      </aside>
    )
  }
}

SidebarContainer.propTypes = {
  selectedPage: PropTypes.string.isRequired
}

function mapStateToProps(state) {
  const selectedPage = state.selectedPage || MY_LOANS_PAGE_STATE

  return {
    selectedPage
  }
}

export default connect(
  mapStateToProps
)(SidebarContainer)
