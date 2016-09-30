import {
  FILTER_LOANS_ERROR, FILTER_LOANS_REQUEST, FILTER_LOANS_SUCCESS
} from '../../actions/admin/filterLoans'

import {
  EXPORT_LOANS_ERROR, EXPORT_LOANS_REQUEST, EXPORT_LOANS_SUCCESS
} from '../../actions/admin/exportLoans'

import {
  FETCH_MEMBERS_FAILURE, FETCH_MEMBERS_REQUEST, FETCH_MEMBERS_SUCCESS
} from '../../actions/admin/fetchMembers'

import {FETCH_MEMBER_LOANS_REQUEST, FETCH_MEMBER_LOANS_SUCCESS, FETCH_MEMBER_LOANS_FAILURE
} from "../../actions/admin/fetchMemberLoans";

import {FETCH_LOAN_SUMMARY_REQUEST,FETCH_LOAN_SUMMARY_SUCCESS, FETCH_LOAN_SUMMARY_FAILURE
} from "../../actions/admin/fetchLoanSummary";

const loanListState = (state = {
  isFetching: false,
  fetchLoansFailed: false,
  loans: [],
  filterContext: {},
}, action) => {
  switch (action.type) {
    case FILTER_LOANS_REQUEST:
      return {
        ...state,
        isFetching: true,
        fetchLoansFailed: false,
        loans: [],
        filterContext: {}
      }
    case FILTER_LOANS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        fetchLoansFailed: false,
        loans: action.loans,
        filterContext: action.filterContext
      }
    case FILTER_LOANS_ERROR:
      return {
        ...state,
        isFetching: false,
        fetchLoansFailed: true,
        loans: [],
        filterContext: {}
      }

    default:
      return state
  }
}

const exportLoansState = (state = {
  isFetching: false,
  fetchLoansFailed: false,
}, action) => {
  switch (action.type) {
    case EXPORT_LOANS_REQUEST:
      return {
        ...state,
        isFetching: true,
        fetchLoansFailed: false,
      }
    case EXPORT_LOANS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        fetchLoansFailed: false,
      }
    case EXPORT_LOANS_ERROR:
      return {
        ...state,
        isFetching: false,
        fetchLoansFailed: true,
      }

    default:
      return state
  }
}

const membersState = (state = {
  isFetching: false,
  isFetchFailed: false,
  members: [],
}, action) => {
  switch (action.type) {
    case FETCH_MEMBERS_REQUEST:
      return {
        ...state,
        isFetching: true,
        isFetchFailed: false,
        members: [],
      }
    case FETCH_MEMBERS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isFetchFailed: false,
        members: action.members,
      }
    case FETCH_MEMBERS_FAILURE:
      return {
        ...state,
        isFetching: false,
        isFetchFailed: true,
        members: [],
      }

    default:
      return state
  }
}

const memberLoansState = (state = {
  isFetching: false,
  isFetchFailed: false,
  memberLoans: [],
}, action) => {
  switch (action.type) {
    case FETCH_MEMBER_LOANS_REQUEST:
      return {
        ...state,
        isFetching: true,
        isFetchFailed: false,
        memberLoans: [],
      }
    case FETCH_MEMBER_LOANS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isFetchFailed: false,
        memberLoans: action.memberLoans,
      }
    case FETCH_MEMBER_LOANS_FAILURE:
      return {
        ...state,
        isFetching: false,
        isFetchFailed: true,
        memberLoans: [],
      }

    default:
      return state
  }
}

const loanSummaryState = (state = {
  isFetching: false,
  isFetchFailed: false,
  loanSummary: {},
}, action) => {
  switch (action.type) {
    case FETCH_LOAN_SUMMARY_REQUEST:
      return {
        ...state,
        isFetching: true,
        isFetchFailed: false,
        loanSummary: {},
      }
    case FETCH_LOAN_SUMMARY_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isFetchFailed: false,
        loanSummary: action.loanSummary,
      }
    case FETCH_LOAN_SUMMARY_FAILURE:
      return {
        ...state,
        isFetching: false,
        isFetchFailed: true,
        loanSummary: {},
      }

    default:
      return state
  }
}

export default {
  loanListState,
  exportLoansState,
  membersState,
  memberLoansState,
  loanSummaryState,
}
