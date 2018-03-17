import { Map } from 'immutable'
import * as constants from '../constants/files.js'

const initialState = Map({
	unlocked: false,
	synced: false,
	balance: '',
})

export default function walletReducer(state = initialState, action) {
	switch (action.type) {
	case constants.RECEIVE_WALLET_LOCKSTATE:
		return state.set('unlocked', action.unlocked)
	case constants.RECEIVE_WALLET_BALANCE:
		return state.set('balance', action.balance)
	case constants.SET_WALLET_SYNCSTATE:
		return state.set('synced', action.synced)
	default:
		return state
	}
}
