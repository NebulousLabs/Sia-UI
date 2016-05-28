import { Map } from 'immutable'
import { SHOW_NEW_WALLET_DIALOG } from '../constants/wallet.js'

const initialState = Map({
	password: '',
	seed: '',
})

export default function newwalletdialog(state = initialState, action) {
	switch (action.type) {
	case SHOW_NEW_WALLET_DIALOG:
		return state.set('password', action.password)
                .set('seed', action.seed)
	default:
		return state
	}
}
