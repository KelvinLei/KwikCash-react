import { combineReducers } from 'redux'

import memberReducers from './member/memberRootReducer'
import loginReducers from './login'

export default combineReducers(
  memberReducers,
  loginReducers
)
