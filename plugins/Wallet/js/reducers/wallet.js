import { Map } from 'immutable';
import { SET_LOCKED, SET_UNLOCKED } from '../constants/locking.js';

const initialState = Map({
	unlocked: false,
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
