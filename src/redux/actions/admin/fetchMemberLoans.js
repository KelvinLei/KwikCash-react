import { fetchMemberLoans } from '../../../api/adminApiClient'

export const FETCH_MEMBER_LOANS_REQUEST = 'FETCH_MEMBERS_LOANS_REQUEST'
export const FETCH_MEMBER_LOANS_SUCCESS = 'FETCH_MEMBERS_LOANS_SUCCESS'
export const FETCH_MEMBER_LOANS_FAILURE = 'FETCH_MEMBERS_LOANS_FAILURE'

export const fetchMemberLoansAction = (memberId) => {
  return (dispatch, getState) => {
    const state = getState()

    dispatch(fetchMemberLoansRequest())

    fetchMemberLoans(memberId)
      .then(response => {
        dispatch(fetchMemberLoansSuccess(response.memberLoans))
      })
      .catch(() => {
        console.log("fetch loan list for member failed id " + memberId)
        dispatch(fetchMemberLoansError())
      })
  }
}

export const fetchMemberLoansRequest = () => {
  return {
    type: FETCH_MEMBER_LOANS_REQUEST
  }
}

export const fetchMemberLoansSuccess = (memberLoans) => {
  return {
    type: FETCH_MEMBER_LOANS_SUCCESS,
    memberLoans: memberLoans,
  }
}

export const fetchMemberLoansError = () => {
  return {
    type: FETCH_MEMBER_LOANS_FAILURE
  }
}