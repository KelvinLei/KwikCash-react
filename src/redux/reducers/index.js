import { combineReducers } from 'redux'

import memberReducers from './member/memberRootReducer.js'

export default combineReducers(Object.assign({},
  memberReducers,
))

