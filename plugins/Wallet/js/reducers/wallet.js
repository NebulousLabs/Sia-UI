import { Map, List} from 'immutable';
import * as constants from '../constants/wallet.js';
import { WALLET_UNLOCK_ERROR } from '../constants/error.js';
import { SIAD_ERROR } from '../constants/error.js';

const initialState = Map({
	unlocked: false,
	encrypted: true,
	unlocking: false,
	confirmedbalance: '',
	unconfirmedbalance: '',
	transactions: List(),
});

export default function walletReducer(state = initialState, action) {
	switch (action.type) {
	case constants.UNLOCK_WALLET:
		return state.set('unlocking', true);
	case WALLET_UNLOCK_ERROR:
		return state.set('unlocking', false);
	case constants.SET_LOCKED:
		return state.set('unlocked', false)
								.set('unlocking', false);
	case constants.SET_UNLOCKED:
		return state.set('unlocked', true)
								.set('unlocking', false);
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
