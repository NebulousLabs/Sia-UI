import { Map } from 'immutable'
import * as constants from '../constants/wallet.js'
import { WALLET_UNLOCK_ERROR } from '../constants/error.js'

const initialState = Map({
	password: '',
	error: '',
})

export default function passwordpromptReducer(state = initialState, action) {
	switch (action.type) {
	case constants.HANDLE_PASSWORD_CHANGE:
		return state.set('password', action.password)
	case WALLET_UNLOCK_ERROR:
		return state.set('error', action.err)
	default:
		return state
	}
}
