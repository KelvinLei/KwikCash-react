import { combineReducers } from 'redux'

import memberReducers from './member/memberRootReducer'
import { getLoginReducers } from './login'

export function getReducers(isAdmin = false) {
  return combineReducers(Object.assign({},
    memberReducers,
    getLoginReducers(isAdmin)
  ))
}
