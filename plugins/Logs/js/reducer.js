import { Map, Set } from 'immutable'
import * as constants from './constants.js'
import { addLogFilters, removeLogFilters, updateLogFilters, parseLogs } from './logparse.js'

const siadir = SiaAPI.config.siad.datadir

const initialState = Map({
	logFilters: Set(['consensus.log', 'gateway.log']),
	logText: parseLogs(siadir, 50000, ['consensus.log', 'gateway.log']),
	
	logSize: 50000,
})

export default function loggingReducer(state = initialState, action) {
	switch (action.type) {
	case constants.ADD_LOG_FILTERS:
		return addLogFilters(state, action.filters)
	case constants.REMOVE_LOG_FILTERS:
		return removeLogFilters(state, action.filters)
	case constants.SET_LOG_FILTERS:
		return updateLogFilters(state, state.get('logSize'), Set(action.filters))
	default:
		return state
	}
}

