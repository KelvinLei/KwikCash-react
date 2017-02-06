import React, { Component } from 'react'
import { connect } from 'react-redux'
import MyProfileContent from '../../../components/member/myProfile/MyProfileContent'
import { fetchGetUserDataAction } from '../../../redux/actions/member/fetchUserData'
import { changePasswordAction, changePasswordReset } from "../../../redux/actions/member/changePassword";

class MyProfile extends Component {

  componentDidMount() {
    const { fetchUserData, resetChangePassword } = this.props
    fetchUserData()
    resetChangePassword()
  }

  render() {
    const { isFetching, isFailed, userData, changePasswordState, changePasswordOnclick } = this.props

    return (
      <div>
        <MyProfileContent isFetching={isFetching}
                          isFailed={isFailed}
                          userData={userData}
                          changePasswordState={changePasswordState}
                          changePasswordOnclick={changePasswordOnclick}
        />
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchUserData         : () => dispatch(fetchGetUserDataAction()),

    changePasswordOnclick : (currPassword, newPassword) => {
      dispatch(changePasswordAction(currPassword, newPassword))
    },

    resetChangePassword   : () => dispatch(changePasswordReset()),
  }
}

function mapStateToProps(state) {
  const { isFetching, isFailed, userData } = state.userDataState

  return {
    isFetching,
    isFailed,
    userData,
    changePasswordState: state.changePasswordState,
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyProfile)
