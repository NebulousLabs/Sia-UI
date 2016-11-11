import * as constants from './constants.js'

export const addLogFilters = (filters) => ({
	type: constants.ADD_LOG_FILTERS,
	filters,
})
export const removeLogFilters = (filters) => ({
	type: constants.REMOVE_LOG_FILTERS,
	filters,
})
export const setLogFilters = (filters) => ({
	type: constants.SET_LOG_FILTERS,
	filters,
})
