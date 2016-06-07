import * as constants from '../constants/commandline.js'

export const addCommand = (command) => ({
	type: constants.ADD_COMMAND,
	command,
})

export const updateCommand = (command, id, dataChunk) => ({
	type: constants.UPDATE_COMMAND,
	command, id,
    dataChunk: dataChunk
})

