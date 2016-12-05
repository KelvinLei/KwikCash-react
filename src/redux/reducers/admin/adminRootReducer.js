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
import {
  FETCH_PAYOFF_REQUEST, FETCH_PAYOFF_SUCCESS, FETCH_PAYOFF_FAILURE
} from "../../actions/admin/fetchPayoff";
import {
  GET_PAYOFF_FORM_FAILURE, GET_PAYOFF_FORM_SUCCESS, GET_PAYOFF_FORM_REQUEST
} from "../../actions/admin/getPayoffAuth";
import {
  FETCH_MEMBER_PROFILE_REQUEST, FETCH_MEMBER_PROFILE_SUCCESS, FETCH_MEMBER_PROFILE_FAILURE
} from "../../actions/admin/fetchMemberProfile";
import {
  EDIT_LOAN_REQUEST, EDIT_LOAN_SUCCESS, EDIT_LOAN_FAILURE, RESET_EDIT_LOAN_ALERT
} from "../../actions/admin/editLoan";
import {
  DELETE_PAYMENT_REQUEST, DELETE_PAYMENT_SUCCESS, DELETE_PAYMENT_FAILURE, RESET_DELETE_PAYMENT_STATE
} from "../../actions/admin/deletePayment";
import {
  WAIVE_PAYMENT_REQUEST, WAIVE_PAYMENT_SUCCESS, WAIVE_PAYMENT_FAILURE, RESET_WAIVE_PAYMENT_STATE
} from "../../actions/admin/waivePayment";
import {
  FETCH_SINGLE_PAYMENT_REQUEST, FETCH_SINGLE_PAYMENT_SUCCESS, FETCH_SINGLE_PAYMENT_FAILURE
} from "../../actions/admin/fetchSinglePayment";
import {
  EDIT_PAYMENT_REQUEST, EDIT_PAYMENT_SUCCESS, EDIT_PAYMENT_FAILURE, RESET_EDIT_PAYMENT_STATE
} from "../../actions/admin/editPayment";
import {
  FETCH_LOAN_STATS_FAILURE, FETCH_LOAN_STATS_REQUEST, FETCH_LOAN_STATS_SUCCESS
} from "../../actions/admin/fetchLoanStats";

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
  isFetching: true,
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

const payoffState = (state = {
  isFetching: true,
  isFailed: false,
  payoff: {}
}, action) => {

  switch (action.type) {
    case FETCH_PAYOFF_REQUEST:
      return {
        ...state,
        isFetching: true,
        isFailed: false,
      }
    case FETCH_PAYOFF_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isFailed: false,
        payoff: action.payoff
      }
    case FETCH_PAYOFF_FAILURE:
      return {
        ...state,
        isFetching: false,
        isFailed: true,
      }
    default:
      return state
  }
}

const getPayoffFormState = (state = {
  isFetching: false,
  isFailed: false,
}, action) => {
  switch (action.type) {
    case GET_PAYOFF_FORM_REQUEST:
      return {
        ...state,
        isFetching: true,
        isFailed: false,
      }
    case GET_PAYOFF_FORM_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isFailed: false,
      }
    case GET_PAYOFF_FORM_FAILURE:
      return {
        ...state,
        isFetching: false,
        isFailed: true,
      }

    default:
      return state
  }
}

const memberProfileState = (state = {
  isFetching: true,
  isFailed: false,
  memberProfile: {},
}, action) => {
  switch (action.type) {
    case FETCH_MEMBER_PROFILE_REQUEST:
      return {
        ...state,
        isFetching: true,
        isFailed: false,
      }
    case FETCH_MEMBER_PROFILE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isFailed: false,
        memberProfile: action.memberProfile,
      }
    case FETCH_MEMBER_PROFILE_FAILURE:
      return {
        ...state,
        isFetching: false,
        isFailed: true,
      }

    default:
      return state
  }
}

const editLoanActionState = (state = {
  isFetching: false,
  isFailed: false,
  editSuccess: false,
}, action) => {
  switch (action.type) {
    case EDIT_LOAN_REQUEST:
      return {
        ...state,
        isFetching: true,
        isFailed: false,
        editSuccess: false,
      }
    case EDIT_LOAN_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isFailed: false,
        editSuccess: true,
      }
    case RESET_EDIT_LOAN_ALERT:
      return {
        ...state,
        isFetching: false,
        isFailed: false,
        editSuccess: false,
      }
    case EDIT_LOAN_FAILURE:
      return {
        ...state,
        isFetching: false,
        isFailed: true,
        editSuccess: false,
      }

    default:
      return state
  }
}

const deletePaymentState = (state = {
  isFetching: false,
  isFailed: false,
  success: false,
  paymentId: 0
}, action) => {
  switch (action.type) {
    case DELETE_PAYMENT_REQUEST:
      return {
        ...state,
        isFetching: true,
        isFailed: false,
        success: false,
        paymentId: action.paymentId,
      }
    case DELETE_PAYMENT_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isFailed: false,
        success: true,
        paymentId: 0,
      }
    case RESET_DELETE_PAYMENT_STATE:
      return {
        ...state,
        isFetching: false,
        isFailed: false,
        success: false,
        paymentId: 0,
      }
    case DELETE_PAYMENT_FAILURE:
      return {
        ...state,
        isFetching: false,
        isFailed: true,
        success: false,
        paymentId: action.paymentId,
      }

    default:
      return state
  }
}

const waivePaymentState = (state = {
  isFetching: false,
  isFailed: false,
  success: false,
  paymentId: 0
}, action) => {
  switch (action.type) {
    case WAIVE_PAYMENT_REQUEST:
      return {
        ...state,
        isFetching: true,
        isFailed: false,
        success: false,
        paymentId: action.paymentId,
      }
    case WAIVE_PAYMENT_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isFailed: false,
        success: true,
        paymentId: 0,
      }
    case RESET_WAIVE_PAYMENT_STATE:
      return {
        ...state,
        isFetching: false,
        isFailed: false,
        success: false,
        paymentId: 0,
      }
    case WAIVE_PAYMENT_FAILURE:
      return {
        ...state,
        isFetching: false,
        isFailed: true,
        success: false,
        paymentId: action.paymentId,
      }

    default:
      return state
  }
}

const fetchSinglePaymentState = (state = {
  isFetching: false,
  isFailed: false,
  payment: {},
}, action) => {
  switch (action.type) {
    case FETCH_SINGLE_PAYMENT_REQUEST:
      return {
        ...state,
        isFetching: true,
        isFailed: false,
        payment: {},
      }
    case FETCH_SINGLE_PAYMENT_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isFailed: false,
        payment: action.payment,
      }
    case FETCH_SINGLE_PAYMENT_FAILURE:
      return {
        ...state,
        isFetching: false,
        isFailed: true,
        payment: {},
      }

    default:
      return state
  }
}

const editPaymentState = (state = {
  isFetching: false,
  isFailed: false,
  editSuccess: false,
}, action) => {
  switch (action.type) {
    case EDIT_PAYMENT_REQUEST:
      return {
        ...state,
        isFetching: true,
        isFailed: false,
        editSuccess: false,
      }
    case EDIT_PAYMENT_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isFailed: false,
        editSuccess: true,
      }
    case RESET_EDIT_PAYMENT_STATE:
      return {
        ...state,
        isFetching: false,
        isFailed: false,
        editSuccess: false,
      }
    case EDIT_PAYMENT_FAILURE:
      return {
        ...state,
        isFetching: false,
        isFailed: true,
        editSuccess: false,
      }

    default:
      return state
  }
}

const loanStatsDataState = (state = {
  isFetching: false,
  isFailed: false,
  loanStats: [],
}, action) => {
  switch (action.type) {
    case FETCH_LOAN_STATS_REQUEST:
      return {
        ...state,
        isFetching: true,
        isFailed: false,
        loanStats: [],
      }
    case FETCH_LOAN_STATS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isFailed: false,
        loanStats: action.loanStats,
      }
    case FETCH_LOAN_STATS_FAILURE:
      return {
        ...state,
        isFetching: false,
        isFailed: true,
        loanStats: [],
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
  payoffState,
  getPayoffFormState,
  memberProfileState,
  editLoanActionState,
  deletePaymentState,
  waivePaymentState,
  fetchSinglePaymentState,
  editPaymentState,
  loanStatsDataState,
}
