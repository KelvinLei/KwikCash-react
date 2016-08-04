import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { LoanSelectionContent } from '../../../components/member/loanSelection/LoanSelectionContent'
import { fetchLoanListAction } from '../../../redux/actions/member/fetchLoanList'
import {fetchGetUserDataAction} from "../../../redux/actions/member/fetchUserData";

export default class LoanSelection extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { fetchLoanList, fetchUserData } = this.props
    fetchLoanList()
    fetchUserData()
  }

  render() {
    const { isFetching, fetchLoansFailed, loans, userDataState } = this.props;

    const firstName = userDataState.isFetching || userDataState.isFailed ? '' : userDataState.userData.firstName
    
    return (
      <div>
        <LoanSelectionContent isFetching={isFetching}
                              fetchLoansFailed={fetchLoansFailed}
                              firstName={firstName}
                              loanList={loans}
        />
      </div>
    )
  }
}

LoanSelection.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  fetchLoansFailed: PropTypes.bool.isRequired,
  loans: PropTypes.array.isRequired,
  fetchLoanList: PropTypes.func.isRequired
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
