import { Map, List } from 'immutable'
import { combineReducers } from 'redux'
import commmandLineReducer from './commandline.js'


/*
const rootReducer = combineReducers({
	commandLineReducer
})
*/

const initialState = Map({
    commandHistory: List([
        { command: "balrg", result: "more balarg", key: 0 },
        { command: "finished with this", result: "Are you certain?", key: 1 }
    ])
})

const rootReducer = function (state = initialState, action) {
	switch (action.type) {
	default:
		return state
	}
}

export default rootReducer
