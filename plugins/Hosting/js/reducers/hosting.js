import { Map, List } from 'immutable'
import * as constants from '../constants/constants.js'

const initialState = Map({
	numContracts: 0,
	storage: 0,
	earned: 0,
	expected: 0,
	walletLocked: true,
	walletsize: 0,
	files: List([]),

	nSettingsCalls: 0,
	connectable: false,
	working: true,
})

export default function hostingReducer(state = initialState, action) {
	switch (action.type) {
	case constants.SET_HOST_WORKING_STATUS:
		return state.set('working', action.status)
	case constants.SET_HOST_CONNECTABILITY_STATUS:
		return state.set('connectable', action.status)
	case constants.SET_HOST_NSETTINGSCALLS:
		return state.set('nSettingsCalls', action.calls)
	case constants.FETCH_DATA_SUCCESS:
		return state.merge(action.data)
	default:
		return state
	}
}
