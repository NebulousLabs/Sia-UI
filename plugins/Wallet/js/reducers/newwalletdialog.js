import { Map } from 'immutable';
import { SHOW_NEW_WALLET_DIALOG, DISMISS_NEW_WALLET_DIALOG } from '../constants/wallet.js';

const initialState = Map({
	visible: false,
	password: '',
	seed: '',
});

export default function newwalletdialog(state = initialState, action) {
	switch (action.type) {
	case SHOW_NEW_WALLET_DIALOG:
		return state.set('visible', true)
								.set('password', action.password)
								.set('seed', action.seed)
								
	case DISMISS_NEW_WALLET_DIALOG:
		return state.set('visible', false);
	default:
		return state;
	}
}
