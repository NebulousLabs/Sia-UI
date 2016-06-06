import { Map, List } from 'immutable'
import * as constants from '../constants/commandline.js'

const initialState = Map({
    commandHistory: List([
        { command: "balrg", result: "more balarg", key: 0 },
        { command: "finished with this", result: "Are you certain?", key: 1 }
    ])
})

export default function commandLineReducer(state = initialState, action) {
	switch (action.type) {
    case constants.ADD_COMMAND:
        console.log("NEW COMMAND!")
        var newCommandHistory = state.get("commandHistory").push(action.command)
        console.log(action.command + " " + newCommandHistory)
        var newstate = state.set("commandHistory", newCommandHistory)
        console.log(JSON.stringify(newstate))
        return newstate

	default:
		return state
	}
}
