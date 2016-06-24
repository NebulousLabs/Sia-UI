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
})

export default function hostingReducer(state = initialState, action) {
	switch (action.type) {
	case constants.FETCH_DATA_SUCCESS:
		return state.merge(action.data)

	default:
		return state
	}
}
