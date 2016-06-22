import { combineReducers } from 'redux'
import {
  SELECT_MEMBER_PAGE, SELECT_PAYMENT_STATUS, SELECT_REFINANCE_VALUE
} from '../../actions/member/memberAction'

function selectPaymentStatus(state = "all", action) {
  switch (action.type) {
    case SELECT_PAYMENT_STATUS:
      return action.selectedStatus

    default:
      return state
  }
}

function selectedPage(state = "myLoan", action) {
  switch (action.type) {
    case SELECT_MEMBER_PAGE:
      return action.selectedNavTab

    default:
      return state
  }
}

function refinanceValue(state = "5000.00", action) {
  switch (action.type) {
    case SELECT_REFINANCE_VALUE:
      return action.selectedRefinanceValue

    default:
      return state
  }
}

const memberReducer = combineReducers({
  selectedPage,
  selectPaymentStatus,
  refinanceValue
})

export default memberReducer