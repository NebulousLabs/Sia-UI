import { combineReducers } from 'redux'
import hostingReducer from './hosting.js'

const rootReducer = combineReducers({
	hostingReducer,
})

export default rootReducer
