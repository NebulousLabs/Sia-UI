import { Map, List } from 'immutable'
import * as constants from '../constants/commandline.js'

const initialState = Map({
    commandHistory: List([]),
    currentCommand: "",
    commandIndex: 0,
    showWalletPrompt: false
})

export default function commandLineReducer(state = initialState, action) {
	switch (action.type) {

        case constants.ADD_COMMAND:
            //Add command to the command history.
            console.log("NEW COMMAND!")
            var newCommandHistory = state.get("commandHistory").push(action.command)
            var newState = state.set("commandHistory", newCommandHistory)
            newState = newState.set("commandIndex", 0)
            newState = newState.set("currentCommand", "")
            return newState

    
        case constants.UPDATE_COMMAND:
            //Updates output of command given by command name and id.
            var newCommandHistory = state.get("commandHistory")
            var [commandIdx, newCommand] = newCommandHistory.findLastEntry(
                (val) => (val.get("command") == action.command && val.get("id") == action.id)
            ) //TODO If val isn't found?
    
            newCommand = newCommand.set('result', newCommand.get('result') + action.dataChunk)
            console.log(newCommand)
            newCommandHistory = newCommandHistory.set(commandIdx, newCommand)
            return state.set("commandHistory", newCommandHistory)


        case constants.LOAD_PREV_COMMAND:
            var newCommandIndex = state.get("commandIndex")
            newCommandIndex++; //How many commands back do we load.
            if (newCommandIndex > state.get("commandHistory").size){
                newCommandIndex = state.get("commandHistory").size
            }
            var newState = state.set("commandIndex", newCommandIndex)
            var returnvalue = state;
            if ( state.get("commandHistory").size-newCommandIndex < state.get("commandHistory").size ){
                returnvalue = newState.set("currentCommand", state.get("commandHistory").get(state.get("commandHistory").size-newCommandIndex).get("command"))
            }
            return returnvalue;


        case constants.LOAD_NEXT_COMMAND:
            var newCommandIndex = state.get("commandIndex")
            newCommandIndex--;
            if (newCommandIndex < 0){ newCommandIndex = 0 }
            var newState = state.set("commandIndex", newCommandIndex)

            if (newCommandIndex){
                newState = newState.set("currentCommand",
                    state.get("commandHistory").get(
                        state.get("commandHistory").size-newCommandIndex
                    ).get("command")
                )
            }     
            else { newState = newState.set("currentCommand", "") }       

            return newState


        case constants.SET_CURRENT_COMMAND:
            return state.set("currentCommand", action.command)


        case constants.SHOW_WALLET_PROMPT:
            return state.set("showWalletPrompt", true)

        case constants.HIDE_WALLET_PROMPT:
            return state.set("showWalletPrompt", false)

 
    	default:
    		return state
	}
}
