import { Map, Set } from 'immutable'
import * as constants from './constants.js'
import { remote } from 'electron'
import { findLogs, parseLogs } from './logparse.js'

const siadir = remote.getGlobal('config').siad.datadir

const initialState = Map({
	logFilters: Set(['consensus.log', 'gateway.log']),
	logText: parseLogs(findLogs(siadir)),
})

const updateLogFilters = (state, filters) =>
	state.set('logFilters', filters)
	     .set('logText', parseLogs(findLogs(siadir, filters)))

const addLogFilters = (state, filters) =>
	updateLogFilters(state, state.get('logFilters').union(filters))

const removeLogFilters = (state, filters) =>
	updateLogFilters(state, state.get('logFilters').subtract(filters))

export default function loggingReducer(state = initialState, action) {
	console.log(action)
	switch (action.type) {
	case constants.ADD_LOG_FILTERS:
		return addLogFilters(state, action.filters)
	case constants.REMOVE_LOG_FILTERS:
		return removeLogFilters(state, action.filters)
	default:
		return state
	}
}

