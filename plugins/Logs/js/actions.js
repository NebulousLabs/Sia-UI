import * as constants from './constants.js'

export const addLogFilter = (filter) => ({
	type: constants.ADD_LOG_FILTER,
	filter,
})
export const removeLogFilter = (filter) => ({
	type: constants.REMOVE_LOG_FILTER,
	filter,
})
