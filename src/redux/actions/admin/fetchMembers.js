import { fetchMembers } from '../../../api/adminApiClient'

export const FETCH_MEMBERS_REQUEST = 'FETCH_MEMBERS_REQUEST'
export const FETCH_MEMBERS_SUCCESS = 'FETCH_MEMBERS_SUCCESS'
export const FETCH_MEMBERS_FAILURE = 'FETCH_MEMBERS_FAILURE'

export const fetchMembersAction = (memberName) => {
  return (dispatch, getState) => {
    const state = getState()

    dispatch(fetchMembersRequest())

    fetchMembers(memberName)
      .then(response => {
        dispatch(fetchMembersSuccess(response.members))
      })
      .catch(() => {
        console.log("fetch members list failed name: " + memberName)
        dispatch(fetchMembersError())
      })
  }
}

export const fetchMembersRequest = () => {
  return {
    type: FETCH_MEMBERS_REQUEST
  }
}

export const fetchMembersSuccess = (members) => {
  return {
    type: FETCH_MEMBERS_SUCCESS,
    members: members,
  }
}

export const fetchMembersError = () => {
  return {
    type: FETCH_MEMBERS_FAILURE
  }
}