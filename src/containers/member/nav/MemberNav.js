import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import MemberNavBar from '../../../components/member/nav/MemberNavBar'
import {MY_LOAN_PAGE_STATE, PAYMENT_PLAN_PAGE_STATE} from "../../../components/member/shared/Constants"

import {selectMemberPage} from '../../../redux/actions/member/memberAction'
import styles from './MemberNavStyle.scss'

export default class MemberNav extends Component {
  render() {
    const { selectedPage } = this.props;
    const loanSummaryClass = selectedPage === MY_LOAN_PAGE_STATE? "active" : "";
    const paymentInfoClass = selectedPage === PAYMENT_PLAN_PAGE_STATE? "active" : "";

    return (
      <div>
        <MemberNavBar loanSummaryClass={loanSummaryClass}
                      paymentInfoClass={paymentInfoClass}
                      onClickNavTab={this.props.handleSelectedNavTab}
        />
      </div>
    )
  }
}

MemberNav.propTypes = {
  selectedPage: PropTypes.string.isRequired
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleSelectedNavTab: (selectedTab) => {
      dispatch(selectMemberPage(selectedTab))
    }
  }
}

function mapStateToProps(state) {
  const selectedPage = state.selectedPage || MY_LOAN_PAGE_STATE

  return {
    selectedPage
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MemberNav)
