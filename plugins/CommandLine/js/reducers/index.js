import { Map, List } from 'immutable'
import { combineReducers } from 'redux'
import commandLineReducer from './commandline.js'

const rootReducer = combineReducers({
	commandLineReducer
})

export default rootReducer
