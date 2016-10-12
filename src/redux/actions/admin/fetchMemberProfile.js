import { fetchMemberProfile } from '../../../api/adminApiClient'

export const FETCH_MEMBER_PROFILE_REQUEST = 'FETCH_MEMBER_PROFILE_REQUEST'
export const FETCH_MEMBER_PROFILE_SUCCESS = 'FETCH_MEMBER_PROFILE_SUCCESS'
export const FETCH_MEMBER_PROFILE_FAILURE = 'FETCH_MEMBER_PROFILE_FAILURE'

export const fetchMemberProfileAction = (memberId) => {
  return (dispatch) => {
    dispatch(fetchMemberProfileRequest())

    fetchMemberProfile(memberId)
      .then(response => {
        dispatch(fetchMemberProfileSuccess(response.memberProfile))
      })
      .catch(() => {
        console.log("fetchMemberProfileAction failed " + memberId)
        dispatch(fetchMemberProfileError())
      })
  }
}

export const fetchMemberProfileRequest = () => {
  return {
    type: FETCH_MEMBER_PROFILE_REQUEST
  }
}

export const fetchMemberProfileSuccess = (memberProfile) => {
  return {
    type: FETCH_MEMBER_PROFILE_SUCCESS,
    memberProfile: memberProfile,
  }
}

export const fetchMemberProfileError = () => {
  return {
    type: FETCH_MEMBER_PROFILE_FAILURE
  }
}