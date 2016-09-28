import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { fetchMemberLoansAction } from '../../redux/actions/admin/fetchMemberLoans'
import { MemberLoansContent } from "../../components/admin/memberLoans/MemberLoansContent";

class MemberLoans extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { fetchMemberLoans } = this.props
    const { memberId } = this.props.params
    fetchMemberLoans(memberId)
  }

  render() {
    const { isFetching,
            isFetchFailed,
            memberLoans } = this.props;

    const { memberId } = this.props.params

    return (
      <div>
        <MemberLoansContent isFetching={isFetching}
                            isFetchFailed={isFetchFailed}
                            memberLoans={memberLoans}
        />
      </div>
    )
  }
}

MemberLoans.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  isFetchFailed: PropTypes.bool.isRequired,
  memberLoans: PropTypes.array.isRequired,
}

const mapDispatchToProps = dispatch => {
  return {
    fetchMemberLoans: (memberId) => dispatch(fetchMemberLoansAction(memberId)),
  }
}

function mapStateToProps(state) {
  const { memberLoansState } = state

  return {
    isFetching: memberLoansState.isFetching,
    isFetchFailed: memberLoansState.isFetchFailed,
    memberLoans: memberLoansState.memberLoans,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MemberLoans)
