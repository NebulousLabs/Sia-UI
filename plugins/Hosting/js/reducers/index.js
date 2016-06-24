import { combineReducers } from 'redux'
import hostingReducer from './hosting.js'
import settingsReducer from './setting.js'

const rootReducer = combineReducers({
	hostingReducer,
	settingsReducer,
})

export default rootReducer
