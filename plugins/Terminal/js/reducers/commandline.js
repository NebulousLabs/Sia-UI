import { Map, List } from 'immutable'
import * as constants from '../constants/commandline.js'

const initialState = Map({
	commandHistory: List([]),
	currentCommand: '',
	commandIndex: 0,
	showWalletPrompt: false,
	showSeedPrompt: false,
	showCommandOverview: true,
})

export default function commandLineReducer(state = initialState, action) {
	switch (action.type) {

	case constants.ADD_COMMAND:
		//Add command to the command history.
		console.log('NEW COMMAND!')
		return state.set('commandHistory', state.get('commandHistory').push(action.command))
			.set('commandIndex', 0).set('currentCommand', '')


	case constants.UPDATE_COMMAND:
		//Updates output of command given by command name and id.
		let commandArray = state.get('commandHistory').findLastEntry(
				(val) => (val.get('command') === action.command && val.get('id') === action.id)
			)

		if (!commandArray) {
			console.log(`Error did not find command: { command: ${action.command}, id: ${action.id} } in command history: ${JSON.stringify(newCommandHistory)}`)
			return state
		}

		let [commandIdx, newCommand] = commandArray

		if (action.dataChunk) {
			newCommand = newCommand.set('result', newCommand.get('result') + action.dataChunk)
		}

		if (action.stat) {
			newCommand = newCommand.set('stat', action.stat)
		}

		console.log(newCommand)
		return state.set('commandHistory', state.get('commandHistory').set(commandIdx, newCommand))

	case constants.LOAD_PREV_COMMAND:
		let newCommandIndex = Math.min(state.get('commandIndex')+1, state.get('commandHistory').size)
		return state.set('commandIndex', newCommandIndex).set('currentCommand',
			state.get('commandHistory').get(
				Math.min( state.get('commandHistory').size-newCommandIndex, state.get('commandHistory').size-1)
			).get('command'))

	case constants.LOAD_NEXT_COMMAND:
		newCommandIndex = Math.max(state.get('commandIndex')-1, 0)
		if (newCommandIndex) {
			return state.set('commandIndex', newCommandIndex).set('currentCommand',
					state.get('commandHistory').get(
						state.get('commandHistory').size-newCommandIndex
					).get('command')
				)
		} else {
			return state.set('commandIndex', newCommandIndex).set('currentCommand', '')
		}

	case constants.SET_CURRENT_COMMAND:
		return state.set('currentCommand', action.command)

	case constants.SHOW_WALLET_PROMPT:
		return state.set('showWalletPrompt', true)

	case constants.HIDE_WALLET_PROMPT:
		return state.set('showWalletPrompt', false)

	case constants.SHOW_SEED_PROMPT:
		return state.set('showSeedPrompt', true)

	case constants.HIDE_SEED_PROMPT:
		return state.set('showSeedPrompt', false)

	case constants.SHOW_COMMAND_OVERVIEW:
		return state.set('showCommandOverview', true)

	case constants.HIDE_COMMAND_OVERVIEW:
		return state.set('showCommandOverview', false)

	default:
		return state
	}
}
