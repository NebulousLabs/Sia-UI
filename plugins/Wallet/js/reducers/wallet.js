import { Map, List } from 'immutable'
import * as constants from '../constants/wallet.js'
import { WALLET_UNLOCK_ERROR } from '../constants/error.js'

const initialState = Map({
	synced: false,
	unlocked: false,
	encrypted: true,
	unlocking: false,
	recovering: false,
	confirmedbalance: '0',
	unconfirmedbalance: '0',
	siafundbalance: '0',
	transactions: List(),
	ntransactions: 30,
	showSendPrompt: false,
	showReceivePrompt: false,
	showNewWalletDialog: false,
	showNewWalletForm: false,
	useCustomPassphrase: false,
	showRecoveryDialog: false,
})

export default function walletReducer(state = initialState, action) {
	switch (action.type) {
	case constants.SEED_RECOVERY_STARTED:
		return state.set('recovering', true)
	case constants.SEED_RECOVERY_FINISHED:
		return state.set('recovering', false)
	case constants.SHOW_NEW_WALLET_DIALOG:
		return state.set('showNewWalletDialog', true)
	case constants.DISMISS_NEW_WALLET_DIALOG:
		return state.set('showNewWalletDialog', false)
	case constants.SHOW_NEW_WALLET_FORM:
		return state.set('showNewWalletForm', true)
	case constants.HIDE_NEW_WALLET_FORM:
		return state.set('showNewWalletForm', false)
	case constants.SHOW_RECEIVE_PROMPT:
		return state.set('showReceivePrompt', true)
	case constants.HIDE_RECEIVE_PROMPT:
		return state.set('showReceivePrompt', false)
	case constants.START_SEND_PROMPT:
		return state.set('showSendPrompt', true)
	case constants.CLOSE_SEND_PROMPT:
		return state.set('showSendPrompt', false)
	case constants.UNLOCK_WALLET:
		return state.set('unlocking', true)
	case WALLET_UNLOCK_ERROR:
		return state.set('unlocking', false)
	case constants.SET_LOCKED:
		return state.set('unlocked', false)
	case constants.SET_UNLOCKED:
		return state.set('unlocked', true)
                .set('unlocking', false)
	case constants.SET_ENCRYPTED:
		return state.set('encrypted', true)
	case constants.SET_UNENCRYPTED:
		return state.set('encrypted', false)
	case constants.SET_SYNCSTATE:
		return state.set('synced', action.synced)
	case constants.SET_BALANCE:
		return state.set('confirmedbalance', action.confirmed)
                .set('unconfirmedbalance', action.unconfirmed)
                .set('siafundbalance', action.siafunds)
	case constants.SHOW_MORE_TRANSACTIONS:
		return state.set('ntransactions', state.get('ntransactions') + action.increment)
	case constants.SET_TRANSACTIONS:
		return state.set('transactions', action.transactions)
	case constants.SET_USE_CUSTOM_PASSPHRASE:
		return state.set('useCustomPassphrase', action.useCustomPassphrase)
	case constants.SHOW_SEED_RECOVERY_DIALOG:
		return state.set('showRecoveryDialog', true)
	case constants.HIDE_SEED_RECOVERY_DIALOG:
		return state.set('showRecoveryDialog', false)
	default:
		return state
	}
}
