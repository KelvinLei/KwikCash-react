import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Sidebar from '../../../themeJsx/Layout/Sidebar'
import { REFINANCE_PAGE_STATE, MY_PROFILE_PAGE_STATE, LOGOUT_PAGE_STATE, MY_LOANS_PAGE_STATE }
  from "../../../components/member/shared/Constants"

import {selectMemberPage} from '../../../redux/actions/member/memberAction'

export default class SidebarContainer extends Component {
  render() {
    const { selectedPage } = this.props;

    // icons provided by bower_components/simple-line-icons/css/simple-line-icons.css
    const tabList = [
      {tabName: 'My Loans',     toLink: '/' + MY_LOANS_PAGE_STATE,      icon: "icon-home",    className: selectedPage === MY_LOANS_PAGE_STATE? "active" : ""},
      {tabName: 'Refinance',    toLink: '/' + REFINANCE_PAGE_STATE,     icon: "icon-support", className: selectedPage === REFINANCE_PAGE_STATE? "active" : ""},
      {tabName: 'My Profile',   toLink: '/' + MY_PROFILE_PAGE_STATE,    icon: "icon-user",    className: selectedPage === MY_PROFILE_PAGE_STATE? "active" : ""},
      {tabName: 'Logout',       toLink: '/' + LOGOUT_PAGE_STATE,        icon: "icon-logout",  className: selectedPage === LOGOUT_PAGE_STATE? "active" : ""}
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

const mapDispatchToProps = (dispatch) => {
  return {
    handleSelectedNavTab: (selectedTab) => {
      const selectedTabValue = selectedTab || MY_LOANS_PAGE_STATE

      dispatch(selectMemberPage(selectedTabValue))
    }
  }
}

function mapStateToProps(state) {
  const selectedPage = state.selectedPage || MY_LOANS_PAGE_STATE

  return {
    selectedPage
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SidebarContainer)
