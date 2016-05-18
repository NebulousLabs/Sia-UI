import { Map } from 'immutable';
import { SET_LOCKED, SET_UNLOCKED, START_PASSWORD_PROMPT, PASSWORD_PROMPT_SUCCESS } from '../constants/locking.js';

const initialState = Map({
	unlocked: false,
	showPasswordPrompt: false,
});

export default function walletReducer(state = initialState, action) {
	switch (action.type) {
	case START_PASSWORD_PROMPT:
		return state.set('showPasswordPrompt', true);
	case PASSWORD_PROMPT_SUCCESS:
		return state.set('showPasswordPrompt', false);
	case SET_LOCKED:
		return state.set('unlocked', false);
	case SET_UNLOCKED:
		return state.set('unlocked', true);
	default:
		return state;
	}
}
