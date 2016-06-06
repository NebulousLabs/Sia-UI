import { Map, List } from 'immutable'
import * as constants from '../constants/commandline.js'

const initialState = Map({
    commandHistory: List([])
})

export default function commandLineReducer(state = initialState, action) {
	switch (action.type) {
    case constants.ADD_COMMAND:
        state.commandHistory.push(action.command)
        return state

	default:
		return state
	}
}
