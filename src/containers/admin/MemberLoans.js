import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { fetchMemberLoansAction } from '../../redux/actions/admin/fetchMemberLoans'
import { MemberLoansContent } from "../../components/admin/memberLoans/MemberLoansContent";
import {fetchMemberProfileAction} from "../../redux/actions/admin/fetchMemberProfile";

class MemberLoans extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { fetchMemberLoans, fetchMemberProfile } = this.props
    const { memberId } = this.props.params
    fetchMemberLoans(memberId)
    fetchMemberProfile(memberId)
  }

  render() {
    const { isFetching,
            isFetchFailed,
            memberLoans,
            memberProfileState } = this.props;

    const { memberId } = this.props.params

    return (
      <div>
        <MemberLoansContent isFetching={isFetching}
                            isFetchFailed={isFetchFailed}
                            memberLoans={memberLoans}
                            memberProfileState={memberProfileState}
        />
      </div>
    )
  }
}

MemberLoans.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  isFetchFailed: PropTypes.bool.isRequired,
  memberLoans: PropTypes.array.isRequired,
  memberProfileState: PropTypes.object.isRequired,
}

const mapDispatchToProps = dispatch => {
  return {
    fetchMemberLoans: (memberId) => dispatch(fetchMemberLoansAction(memberId)),
    fetchMemberProfile: (memberId) => dispatch(fetchMemberProfileAction(memberId))
  }
}

function mapStateToProps(state) {
  const { memberProfileState, memberLoansState } = state

  return {
    isFetching: memberLoansState.isFetching,
    isFetchFailed: memberLoansState.isFetchFailed,
    memberLoans: memberLoansState.memberLoans,
    memberProfileState: memberProfileState,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MemberLoans)
