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

const addLogFilter = (state, filter) =>
	updateLogFilters(state, state.get('logFilters').add(filter))

const removeLogFilter = (state, filter) =>
	updateLogFilters(state, state.get('logFilters').delete(filter))

export default function loggingReducer(state = initialState, action) {
	console.log(action)
	switch (action.type) {
	case constants.ADD_LOG_FILTER:
		return addLogFilter(state, action.filter)
	case constants.REMOVE_LOG_FILTER:
		return removeLogFilter(state, action.filter)
	default:
		return state
	}
}

