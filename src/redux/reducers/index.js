import { combineReducers } from 'redux'

import memberReducers from './member/memberRootReducer.js'
import loginReducers from './login'

export default combineReducers(Object.assign({},
  memberReducers,
  loginReducers
))

