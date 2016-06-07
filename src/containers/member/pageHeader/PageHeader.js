import React, { Component } from 'react'
import { connect } from 'react-redux'
import PageHeaderComp from '../../../components/member/pageHeader/PageHeaderComp'
import {MY_LOAN_PAGE} from '../nav/MemberNav'

export default class PageHeader extends Component {
  render() {
    const { selectedPage } = this.props;

    return (
      <div>
        <PageHeaderComp selectedPage={selectedPage}/>
      </div>
    )
  }
}

function mapStateToProps(state) {
  const selectedPage = state.selectedPage || MY_LOAN_PAGE

  return {
    selectedPage
  }
}

export default connect(
  mapStateToProps
)(PageHeader)
