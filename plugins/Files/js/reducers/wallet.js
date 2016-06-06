import { Map } from 'immutable'
import * as constants from '../constants/files.js'

const initialState = Map({
	unlocked: false,
	balance: '',
	showAllowanceDialog: false,
})

export default function walletReducer(state = initialState, action) {
	switch (action.type) {
	case constants.RECEIVE_WALLET_LOCKSTATE:
		return state.set('unlocked', action.unlocked)
	case constants.RECEIVE_WALLET_BALANCE:
		return state.set('balance', action.balance)
	case constants.SHOW_ALLOWANCE_DIALOG:
		return state.set('showAllowanceDialog', true)
	case constants.CLOSE_ALLOWANCE_DIALOG:
		return state.set('showAllowanceDialog', false)
	default:
		return state
	}
}
