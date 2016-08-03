import { Map } from 'immutable'
import { SHOW_NEW_WALLET_DIALOG, SHOW_CONFIRMATION_DIALOG, HIDE_CONFIRMATION_DIALOG } from '../constants/wallet.js'

const initialState = Map({
	password: '',
	seed: '',
	showConfirmationDialog: false,
})

export default function newwalletdialog(state = initialState, action) {
	switch (action.type) {
	case SHOW_NEW_WALLET_DIALOG:
		return state.set('password', action.password)
		            .set('seed', action.seed)
	case SHOW_CONFIRMATION_DIALOG:
		return state.set('showConfirmationDialog', true)
	case HIDE_CONFIRMATION_DIALOG:
		return state.set('showConfirmationDialog', false)
	default:
		return state
	}
}
