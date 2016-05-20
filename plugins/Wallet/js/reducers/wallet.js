import { Map } from 'immutable';
import { SET_LOCKED, SET_BALANCE, SET_UNLOCKED, SET_ENCRYPTED, SET_UNENCRYPTED } from '../constants/wallet.js';
import { SIAD_ERROR } from '../constants/error.js';

const initialState = Map({
	unlocked: false,
	encrypted: false,
	confirmedbalance: 0.0,
	unconfirmedbalance: 0.0,
});

export default function walletReducer(state = initialState, action) {
	switch (action.type) {
	case SET_LOCKED:
		return state.set('unlocked', false);
	case SET_UNLOCKED:
		return state.set('unlocked', true);
	case SET_ENCRYPTED:
		return state.set('encrypted', true);
	case SET_UNENCRYPTED:
		return state.set('encrypted', false);
	case SET_BALANCE:
		return state.set('confirmedbalance', action.confirmed)
								.set('unconfirmedbalance', action.unconfirmed);
	default:
		return state;
	}
}
