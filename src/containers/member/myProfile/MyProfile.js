import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { MyProfileContent } from '../../../components/member/myProfile/MyProfileContent'
import { fetchGetUserDataAction } from '../../../redux/actions/member/fetchUserData'

class MyProfile extends Component {

  componentDidMount() {
    const { fetchUserData } = this.props
    fetchUserData();
  }

  render() {
    const { isFetching, isFailed, userData } = this.props

    return (
      <div>
        <MyProfileContent isFetching={isFetching}
                          isFailed={isFailed}
                          userData={userData}/>
      </div>
    )
  }
}

MyProfile.propTypes = {
  isFailed: PropTypes.bool.isRequired,
  isFetching: PropTypes.bool.isRequired,
  userData: PropTypes.object.isRequired
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUserData: () => dispatch(fetchGetUserDataAction())
  }
}

function mapStateToProps(state) {
  const { isFetching, isFailed, userData } = state.userDataState

  return {
    isFetching,
    isFailed,
    userData,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyProfile)
