import { combineReducers } from 'redux'
import {
  SELECT_MEMBER_PAGE, SELECT_PAYMENT_STATUS
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
      console.log(action.selectedNavTab)
      return action.selectedNavTab

    default:
      return state
  }
}

const memberReducer = combineReducers({
  selectedPage,
  selectPaymentStatus
})

export default memberReducer