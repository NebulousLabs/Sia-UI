import { Map } from 'immutable';
import { LOCK_WALLET, UNLOCK_WALLET } from '../constants/locking.js';

const initialState = Map({
	unlocked: false,
});

export default function walletReducer(state = initialState, action) {
	console.log(state.get('unlocked'));
	switch (action.type) {
	case LOCK_WALLET:
		return state.set('unlocked', false);
	case UNLOCK_WALLET:
		return state.set('unlocked', true);
	default:
		return state;
	}
}
