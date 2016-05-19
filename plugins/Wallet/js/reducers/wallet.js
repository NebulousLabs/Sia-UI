import { Map } from 'immutable';
import { SET_LOCKED, SET_UNLOCKED, SET_ENCRYPTED, SET_UNENCRYPTED } from '../constants/locking.js';

const initialState = Map({
	unlocked: false,
	encrypted: false,
});

export default function walletReducer(state = initialState, action) {
	switch (action.type) {
	case SET_LOCKED:
		return state.set('unlocked', false);
	case SET_UNLOCKED:
		return state.set('unlocked', true);
	default:
		return state;
	}
}
