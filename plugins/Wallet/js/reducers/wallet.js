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
	showSendPrompt: false,
	showReceivePrompt: false,
	showNewWalletDialog: false,
});

export default function walletReducer(state = initialState, action) {
	switch (action.type) {
	case constants.SHOW_NEW_WALLET_DIALOG:
		return state.set('showNewWalletDialog', true);
	case constants.DISMISS_NEW_WALLET_DIALOG:
		return state.set('showNewWalletDialog', false);
	case constants.SHOW_RECEIVE_PROMPT:
		return state.set('showReceivePrompt', true);
	case constants.HIDE_RECEIVE_PROMPT:
		return state.set('showReceivePrompt', false);
	case constants.START_SEND_PROMPT:
		return state.set('showSendPrompt', true);
	case constants.CLOSE_SEND_PROMPT:
		return state.set('showSendPrompt', false);
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
