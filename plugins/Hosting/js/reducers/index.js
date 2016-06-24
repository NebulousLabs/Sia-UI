import { combineReducers } from 'redux'
import hostingReducer from './hosting.js'
import settingsReducer from './setting.js'
import modalReducer from './modal.js'

const rootReducer = combineReducers({
	hostingReducer,
	settingsReducer,
	modalReducer,
})

export default rootReducer
