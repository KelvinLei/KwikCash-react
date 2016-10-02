import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import ContentWrapper from '../../themeJsx/Layout/ContentWrapper';
import { fetchMembersAction } from '../../redux/actions/admin/fetchMembers'
import MembersDataTable from "../../components/admin/members/MembersDataTable";
import { MembersFilter } from "../../components/admin/members/MembersFilter";
import { LoadingSpinner } from '../../components/shared/LoadingSpinner'
import { Row, Col, Panel, Table, Grid, Button } from 'react-bootstrap';

class MembersAdmin extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { fetchMembers } = this.props
    fetchMembers("")
  }

  render() {
    const { isFetching,
            isFetchFailed,
            members,
            fetchMembers } = this.props;


    let membersDataTable
    if (isFetching) {
      membersDataTable = <LoadingSpinner/>
    }
    else if (isFetchFailed) {
      membersDataTable = <div>Failure</div>
    }
    else {
      membersDataTable = <MembersDataTable members={members} />
    }

    return (
      <ContentWrapper>
        <Row>
          <Col md={ 12 }>
            <MembersFilter fetchMembers={fetchMembers}/>
          </Col>
        </Row>

        <Row>
          <Col md={ 12 }>
            { membersDataTable }
          </Col>
        </Row>
      </ContentWrapper>
    )
  }
}

MembersAdmin.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  isFetchFailed: PropTypes.bool.isRequired,
  members: PropTypes.array.isRequired,
}

const mapDispatchToProps = dispatch => {
  return {
    fetchMembers: (memberName) => dispatch(fetchMembersAction(memberName)),
  }
}

function mapStateToProps(state) {
  const { membersState } = state

  return {
    isFetching: membersState.isFetching,
    isFetchFailed: membersState.isFetchFailed,
    members: membersState.members,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MembersAdmin)
