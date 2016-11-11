import { Map, Set } from 'immutable'
import * as constants from './constants.js'
import { addLogFilters, removeLogFilters, parseLogs } from './logparse.js'

const siadir = SiaAPI.config.siad.datadir

const initialState = Map({
	logFilters: Set(['consensus.log', 'gateway.log']),
	logText: parseLogs(siadir, ['consensus.log', 'gateway.log']),
})

export default function loggingReducer(state = initialState, action) {
	switch (action.type) {
	case constants.ADD_LOG_FILTERS:
		return addLogFilters(state, action.filters)
	case constants.REMOVE_LOG_FILTERS:
		return removeLogFilters(state, action.filters)
	default:
		return state
	}
}

