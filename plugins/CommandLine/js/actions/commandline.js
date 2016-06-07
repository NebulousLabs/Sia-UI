import * as constants from '../constants/commandline.js'

export const addCommand = (command) => ({
	type: constants.ADD_COMMAND,
	command,
})

export const updateCommand = (command, id, dataChunk) => ({
	type: constants.UPDATE_COMMAND,
	command, id,
    dataChunk
})

export const loadPrevCommand = () => ({
	type: constants.LOAD_PREV_COMMAND,
})

export const loadNextCommand = () => ({
	type: constants.LOAD_NEXT_COMMAND,
})

export const setCurrentCommand = (commandText) => ({
    type: constants.SET_CURRENT_COMMAND,
    command: commandText
})
