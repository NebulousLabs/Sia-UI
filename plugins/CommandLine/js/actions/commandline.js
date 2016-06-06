import * as constants from '../constants/commandline.js'

export const addCommand = (command) => ({
	type: constants.ADD_COMMAND,
	command,
})

