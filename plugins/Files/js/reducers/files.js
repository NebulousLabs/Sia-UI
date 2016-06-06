import { Map } from 'immutable'
import * as constants from '../constants/files.js'

const initialState = Map({
	activespending: '',
	allocatedspending: '',
})

export default function filesReducer(state = initialState, action) {
	console.log(action.type)
	switch (action.type) {
	case constants.RECEIVE_METRICS:
		return state.set('activespending', action.activespending)
                .set('allocatedspending', action.allocatedspending)
	default:
		return state
	}
}
