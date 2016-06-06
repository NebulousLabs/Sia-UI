import { Map, List } from 'immutable'
import { combineReducers } from 'redux'
import commandLineReducer from './commandline.js'



const rootReducer = combineReducers({
	commandLineReducer
})


/*const rootReducer = function (state = initialState, action) {
	switch (action.type) {
	default:
		return state
	}
}*/

export default rootReducer
