import { Map } from 'immutable';
import { HANDLE_PASSWORD_CHANGE, START_PASSWORD_PROMPT, PASSWORD_PROMPT_SUCCESS, PASSWORD_PROMPT_FAILURE } from '../constants/passwordprompt.js';
import { SET_LOCKED, SET_UNLOCKED, SET_UNENCRYPTED } from '../constants/wallet.js';
import { WALLET_UNLOCK_ERROR } from '../constants/error.js';

const initialState = Map({
	visible: true,
	password: '',
	error: '',
});

export default function passwordpromptReducer(state = initialState, action) {
	switch (action.type) {
	case SET_LOCKED:
		return state.set('visible', true);
	case SET_UNLOCKED:
		return state.set('visible', false);
	case SET_UNENCRYPTED:
		return state.set('visible', false);
	case PASSWORD_PROMPT_SUCCESS:
		return state.set('visible', false);
	case START_PASSWORD_PROMPT:
		return state.set('visible', true);
	case HANDLE_PASSWORD_CHANGE:
		return state.set('password', action.password);
	case WALLET_UNLOCK_ERROR:
		return state.set('error', action.err);
	default:
		return state;
	}
}
