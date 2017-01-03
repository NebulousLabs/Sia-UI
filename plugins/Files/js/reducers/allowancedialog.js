import { Map } from 'immutable'
import * as constants from '../constants/files.js'

const initialState = Map({
	storageEstimate: '0 B',
	feeEstimate: 0,
	confirming: false,
	confirmationAllowance: '0',
})

export default function allowancedialogReduceR(state = initialState, action) {
	switch (action.type) {
	case constants.SHOW_ALLOWANCE_CONFIRMATION:
		return state.set('confirming', true)
		            .set('confirmationAllowance', action.allowance)
	case constants.HIDE_ALLOWANCE_CONFIRMATION:
		return state.set('confirming', false)
	case constants.CLOSE_ALLOWANCE_DIALOG:
		return state.set('confirming', false)
	case constants.SET_FEE_ESTIMATE:
		return state.set('feeEstimate', action.estimate)
	case constants.SET_STORAGE_ESTIMATE:
		return state.set('storageEstimate', action.estimate)
	default:
		return state
	}
}

