import { Map, List } from 'immutable'
import * as constants from '../constants/commandline.js'

const initialState = Map({
	commandHistory: List([]),
	currentCommand: '',
	commandIndex: 0,
	showWalletPrompt: false,
	showSeedPrompt: false,
	showCommandOverview: false,
	commandRunning: false,
	walletPassword: '',
})

export default function commandLineReducer(state = initialState, action) {
	switch (action.type) {

	case constants.ADD_COMMAND:
		//Add command to the command history.
		return state.set('commandHistory', state.get('commandHistory').push(action.command))
			.set('commandIndex', 0).set('currentCommand', '').set('commandRunning', true)


	case constants.UPDATE_COMMAND: {
		//Updates output of command given by command name and id.
		const commandArray = state.get('commandHistory').findLastEntry(
				(val) => (val.get('command') === action.command && val.get('id') === action.id)
			)

		if (!commandArray) {
			return state
		}

		const [commandIdx, command] = commandArray
		const newCommand = command.set('result', command.get('result') + action.dataChunk)
		return state.set('commandHistory', state.get('commandHistory').set(commandIdx, newCommand))
	}

	case constants.END_COMMAND: {
		const commandArray = state.get('commandHistory').findLastEntry(
				(val) => (val.get('command') === action.command && val.get('id') === action.id)
			)

		if (!commandArray) {
			return state
		}

		const [commandIdx, command] = commandArray
		const newCommand = command.set('stat', 'done')
		return state.set('commandHistory', state.get('commandHistory').set(commandIdx, newCommand)).set('commandRunning', false)
	}

	case constants.LOAD_PREV_COMMAND: {
		const newCommandIndex = Math.min(state.get('commandIndex')+1, state.get('commandHistory').size)
		return state.set('commandIndex', newCommandIndex).set('currentCommand',
			state.get('commandHistory').get(
				Math.min( state.get('commandHistory').size-newCommandIndex, state.get('commandHistory').size-1)
			).get('command'))
	}

	case constants.LOAD_NEXT_COMMAND: {
		const newCommandIndex = Math.max(state.get('commandIndex')-1, 0)
		if (newCommandIndex) {
			return state.set('commandIndex', newCommandIndex).set('currentCommand',
					state.get('commandHistory').get(
						state.get('commandHistory').size-newCommandIndex
					).get('command')
				)
		} else {
			return state.set('commandIndex', newCommandIndex).set('currentCommand', '')
		}
	}

	case constants.SET_CURRENT_COMMAND:
		return state.set('currentCommand', action.command)

	case constants.SET_WALLET_PASSWORD:
		return state.set('walletPassword', action.walletPassword)

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
