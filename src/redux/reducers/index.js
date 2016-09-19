import { combineReducers } from 'redux'

import memberReducers from './member/memberRootReducer'
import adminReducers from './admin/adminRootReducer'
import { getLoginReducers } from './login'

export function getReducersForMember() {
  return combineReducers(Object.assign({},
    memberReducers,
    getLoginReducers()
  ))
}

export function getReducersForAdmin() {
  return combineReducers(Object.assign({},
    adminReducers,
    getLoginReducers(true)
  ))
}
