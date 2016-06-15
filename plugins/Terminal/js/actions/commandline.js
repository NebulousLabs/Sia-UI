import * as constants from '../constants/commandline.js'

export const addCommand = (command) => ({
	type: constants.ADD_COMMAND,
	command,
})
export const updateCommand = (command, id, dataChunk) => ({
	type: constants.UPDATE_COMMAND,
	command, id, dataChunk,
})
export const endCommand = (command, id) => ({
	type: constants.END_COMMAND,
	command, id,
})

export const loadPrevCommand = () => ({
	type: constants.LOAD_PREV_COMMAND,
})
export const loadNextCommand = () => ({
	type: constants.LOAD_NEXT_COMMAND,
})
export const setCurrentCommand = (commandText) => ({
	type: constants.SET_CURRENT_COMMAND,
	command: commandText,
})

export const setWalletPassword = (walletPassword) => ({
	type: constants.SET_WALLET_PASSWORD,
	walletPassword,
})

export const showWalletPrompt = () => ({
	type: constants.SHOW_WALLET_PROMPT,
})
export const hideWalletPrompt = () => ({
	type: constants.HIDE_WALLET_PROMPT,
})

export const showSeedPrompt = () => ({
	type: constants.SHOW_SEED_PROMPT,
})
export const hideSeedPrompt = () => ({
	type: constants.HIDE_SEED_PROMPT,
})

export const showCommandOverview = () => ({
	type: constants.SHOW_COMMAND_OVERVIEW,
})
export const hideCommandOverview = () => ({
	type: constants.HIDE_COMMAND_OVERVIEW,
})
