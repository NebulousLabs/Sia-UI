import { takeLatest, takeEvery } from 'redux-saga';
import { call, put, take } from 'redux-saga/effects';
import { siadCall, parseRawTransactions } from './helpers.js';
import * as actions from '../actions/wallet.js';
import * as constants from '../constants/wallet.js';
import { siadError, walletUnlockError } from '../actions/error.js';
import Siad from 'sia.js'
const IPC = require('electron').ipcRenderer;
Siad.configure(IPC.sendSync('config', 'siad'));

// Send an error notification over IPC.
const sendError = (e) => {
	IPC.sendSync('dialog', 'error', {
		title: 'Sia-UI Wallet Error',
		content: e.toString(),
	});
}

function *getLockStatusSaga(action) {
	try {
		const response = yield siadCall(Siad, '/wallet');
		if (!response.unlocked) {
			yield put(actions.setLocked());
		} else {
			yield put(actions.setUnlocked());
		}
		if (response.encrypted) {
			yield put(actions.setEncrypted());
		} else {
			yield put(actions.setUnencrypted());
		}
	} catch (e) {
		yield sendError(e);
	}
}


function *walletUnlockSaga(action) {
	try {
		const response = yield siadCall(Siad, {
			url: '/wallet/unlock',
			method: 'POST',
			qs: {
				encryptionpassword: action.password,
			}
		});
		yield put(actions.setEncrypted());
		yield put(actions.setUnlocked());
	} catch (e) {
		yield put(walletUnlockError(e));
	}
}

function *createWalletSaga(action) {
	try {
		const response = yield siadCall(Siad, {
			url: '/wallet/init',
			method: 'POST',
			qs: {
				dictionary: 'english',
			},
		});
		yield put(actions.showNewWalletDialog(response.primaryseed, response.primaryseed));
		yield take(constants.DISMISS_NEW_WALLET_DIALOG);
		yield put(actions.unlockWallet(response.primaryseed));
	} catch (e) {
		yield sendError(e);
	}
}

function *getBalanceSaga(action) {
	try {
		const response = yield siadCall(Siad, '/wallet');
		const confirmed = Siad.hastingsToSiacoins(response.confirmedsiacoinbalance);
		const unconfirmedIncoming = Siad.hastingsToSiacoins(response.unconfirmedincomingsiacoins);
		const unconfirmedOutgoing = Siad.hastingsToSiacoins(response.unconfirmedoutgoingsiacoins);
		const unconfirmed = unconfirmedIncoming.minus(unconfirmedOutgoing);
		yield put(actions.setBalance(confirmed.round(2).toString(), unconfirmed.round(2).toString()));
	} catch (e) {
		yield sendError(e);
	}
}

function *getTransactionsSaga(action) {
	try {
		const response = yield siadCall(Siad, '/wallet/transactions?startheight=0&endheight=10000000');
		// TODO: pagination
		const transactions = parseRawTransactions(response).take(50);
		yield put(actions.setTransactions(transactions));
	} catch (e) {
		yield sendError(e);
	}
}

function *getNewReceiveAddressSaga(action) {
	try {
		const response = yield siadCall(Siad, '/wallet/address');
		yield put(actions.setReceiveAddress(response.address));
		yield put(actions.showReceivePrompt());
	} catch(e) {
		yield sendError(e);
	}
}

function *sendSiacoinSaga(action) {
	try {
		const response = yield siadCall(Siad, {
			url: '/wallet/siacoins',
			method: 'POST',
			qs: {
				destination: action.destination,
				amount: Siad.siacoinsToHastings(action.amount).toString(),
			}
		});
		yield put(actions.closeSendPrompt());
		yield put(actions.getBalance());
		yield put(actions.getTransactions());
	} catch(e) {
		yield sendError(e);
	}
}

// Consume any CREATE_NEW_WALLET actions
export function* watchCreateNewWallet() {
	yield *takeEvery(constants.CREATE_NEW_WALLET, createWalletSaga);
}
// Consume any GET_LOCK_STATUS actions
export function* watchGetLockStatus() {
	yield *takeEvery(constants.GET_LOCK_STATUS, getLockStatusSaga);
}
// Consume any UNLOCK_WALLET actions
export function* watchUnlockWallet() {
	yield *takeEvery(constants.UNLOCK_WALLET, walletUnlockSaga);
}
// Consume any GET_BALANCE actions
export function* watchGetBalance() {
	yield *takeEvery(constants.GET_BALANCE, getBalanceSaga);
}
export function* watchGetTransactions() {
	yield *takeEvery(constants.GET_TRANSACTIONS, getTransactionsSaga);
}
export function* watchGetNewReceiveAddress() {
	yield *takeEvery(constants.GET_NEW_RECEIVE_ADDRESS, getNewReceiveAddressSaga);
}
export function* watchSendSiacoin() {
	yield *takeEvery(constants.SEND_SIACOIN, sendSiacoinSaga);
}