import { combineReducers } from 'redux'

import memberReducers from './member/memberRootReducer.js'
import loginReducers from './login'

console.log(loginReducers)
console.log(memberReducers)

export default combineReducers(Object.assign({},
  memberReducers,
  loginReducers
))

