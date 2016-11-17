import { Map, Set } from 'immutable'
import * as constants from './constants.js'
import { addLogFilters, removeLogFilters, updateLogFilters, parseLogs } from './logparse.js'

const siadir = SiaAPI.config.siad.datadir
const defaultLogSize = 50000

const initialState = Map({
	logFilters: Set(['consensus.log', 'gateway.log']),
	logText: parseLogs(siadir, 50000, ['consensus.log', 'gateway.log']),
	logSize: defaultLogSize,

	scrolling: false,
})

export default function loggingReducer(state = initialState, action) {
	switch (action.type) {
	case constants.INCREMENT_LOG_SIZE:
		return updateLogFilters(state, state.get('logSize') + action.increment, state.get('logFilters'))
	case constants.RELOAD_LOG:
		return updateLogFilters(state, state.get('logSize'), state.get('logFilters'))
	case constants.ADD_LOG_FILTERS:
		return addLogFilters(state, action.filters)
	case constants.REMOVE_LOG_FILTERS:
		return removeLogFilters(state, action.filters)
	case constants.SET_LOG_FILTERS:
		return updateLogFilters(state, state.get('logSize'), Set(action.filters)).set('logSize', defaultLogSize)
	case constants.SET_SCROLLING:
		return state.set('scrolling', true)
	case constants.SET_NOT_SCROLLING:
		return state.set('scrolling', false)
	default:
		return state
	}
}

