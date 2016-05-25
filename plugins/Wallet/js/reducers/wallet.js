import { Map, List} from 'immutable';
import * as constants from '../constants/wallet.js';
import { SIAD_ERROR } from '../constants/error.js';

const initialState = Map({
	unlocked: false,
	encrypted: true,
	confirmedbalance: 0.0,
	unconfirmedbalance: 0.0,
	transactions: List(),
});

export default function walletReducer(state = initialState, action) {
	switch (action.type) {
	case constants.SET_LOCKED:
		return state.set('unlocked', false);
	case constants.SET_UNLOCKED:
		return state.set('unlocked', true);
	case constants.SET_ENCRYPTED:
		return state.set('encrypted', true);
	case constants.SET_UNENCRYPTED:
		return state.set('encrypted', false);
	case constants.SET_BALANCE:
		return state.set('confirmedbalance', action.confirmed)
								.set('unconfirmedbalance', action.unconfirmed);
	case constants.SET_TRANSACTIONS:
		return state.set('transactions', action.transactions);
	default:
		return state;
	}
}
