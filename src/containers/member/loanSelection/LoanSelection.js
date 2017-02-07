import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { LoanSelectionContent } from '../../../components/member/loanSelection/LoanSelectionContent'
import { fetchLoanListAction } from '../../../redux/actions/member/fetchLoanList'
import {fetchGetUserDataAction} from "../../../redux/actions/member/fetchUserData";

class LoanSelection extends Component {

  UNFUNDED_STATES = new Set(['NM', 'SC', 'IL', 'GA']);

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { fetchLoanList, fetchUserData } = this.props
    fetchLoanList()
    fetchUserData()
  }

  /**
   * eligible to reapply only if user is in funded states and all loans satifify reapply
   */
  isEligibleToReapply(loanList, userState) {
    if (this.UNFUNDED_STATES.has(userState)) {
      return false
    }

    return loanList.reduce( (prevData, currLoan) => {
      return prevData && currLoan.canReapply
    }, true)
  }

  render() {
    const { isFetching, fetchLoansFailed, loans, userDataState } = this.props;

    let canReapply = false
    let firstName = ''
    if (!userDataState.isFetching && !userDataState.isFailed) {
      firstName = userDataState.userData.firstName
      canReapply = this.isEligibleToReapply(loans, userDataState.userData.state)
    }
    
    return (
      <div>
        <LoanSelectionContent isFetching={isFetching}
                              fetchLoansFailed={fetchLoansFailed}
                              firstName={firstName}
                              loanList={loans}
                              canReapply={canReapply}
        />
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchLoanList: () => dispatch(fetchLoanListAction()),

    fetchUserData: () => dispatch(fetchGetUserDataAction())
  }
}

function mapStateToProps(state) {
  const { loanList, userDataState } = state

  return {
    isFetching: loanList.isFetching,
    fetchLoansFailed: loanList.fetchLoansFailed,
    loans: loanList.loans,
    userDataState
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoanSelection)
