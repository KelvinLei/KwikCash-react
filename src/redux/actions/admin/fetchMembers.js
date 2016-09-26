import { fetchMembers } from '../../../api/adminApiClient'

export const FETCH_MEMBERS_REQUEST = 'FETCH_MEMBERS_REQUEST'
export const FETCH_MEMBERS_SUCCESS = 'FETCH_MEMBERS_SUCCESS'
export const FETCH_MEMBERS_FAILURE = 'FETCH_MEMBERS_FAILURE'

/*
 Fetch loan list data if no data has been cached
 */
export const fetchMembersAction = (memberName) => {
  return (dispatch, getState) => {
    const state = getState()

    dispatch(fetchMembersRequest())

    fetchMembers(memberName)
      .then(response => {
        dispatch(fetchMembersSuccess(response.members))
      })
      .catch(() => {
        console.log("fetch loan list failed")
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