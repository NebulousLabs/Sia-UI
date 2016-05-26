import { Map } from 'immutable';
import * as constants from '../constants/wallet.js';
import { WALLET_UNLOCK_ERROR } from '../constants/error.js';

const initialState = Map({
	visible: true,
	password: '',
	error: '',
});

export default function passwordpromptReducer(state = initialState, action) {
	switch (action.type) {
	case constants.UNLOCK_WALLET:
		return state.set('unlocking', true);
	case constants.SET_LOCKED:
		return state.set('visible', true);
	case constants.SET_UNLOCKED:
		return state.set('visible', false);
	case constants.SET_UNENCRYPTED:
		return state.set('visible', false);
	case constants.PASSWORD_PROMPT_SUCCESS:
		return state.set('visible', false);
	case constants.START_PASSWORD_PROMPT:
		return state.set('visible', true);
	case constants.HANDLE_PASSWORD_CHANGE:
		return state.set('password', action.password);
	case WALLET_UNLOCK_ERROR:
		return state.set('error', action.err);
	default:
		return state;
	}
}
