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
export const incrementLogSize = (increment = 50000) => ({
	type: constants.INCREMENT_LOG_SIZE,
	increment,
})
export const reloadLog = () => ({
	type: constants.RELOAD_LOG,
})
export const setScrolling = () => ({
	type: constants.SET_SCROLLING,
})
export const setNotScrolling = () => ({
	type: constants.SET_NOT_SCROLLING,
})
