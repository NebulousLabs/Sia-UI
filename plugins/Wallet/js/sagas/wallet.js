import { takeLatest, takeEvery } from 'redux-saga';
import { call, put, take } from 'redux-saga/effects';
import { siadCall, hastingsToSiacoin, parseRawTransactions } from './helpers.js';
import * as actions from '../actions/wallet.js';
import * as constants from '../constants/wallet.js';
import { siadError, walletUnlockError } from '../actions/error.js';
import Siad from 'sia.js'
const IPC = require('electron').ipcRenderer;
Siad.configure(IPC.sendSync('config', 'siad'));

// Asynchronously get Siad's wallet status, and elegantly handle any side effects
function *getLockStatus(action) {
	try {
		// Request /wallet from the Siad API.
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
		console.error(e);
		yield put(siadError(e));
	}
}

function *walletUnlock(action) {
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

function *createWallet(action) {
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
		yield put(siadError(e));
	}
}

function *getBalance(action) {
	try {
		const response = yield siadCall(Siad, '/wallet');
		yield put(actions.setBalance(hastingsToSiacoin(response.confirmedsiacoinbalance), hastingsToSiacoin(response.unconfirmedincomingsiacoins)));
	} catch (e) {
		console.error(e);
		yield put(siadError(e));
	}
}

function *getAddresses(action) {
	try {
		const response = yield siadCall(Siad, '/wallet/addresses');
		// TODO: pagination
		yield put(actions.setAddresses(response.addresses.slice(1,30)));
	} catch (e) {
		console.error(e);
		yield put(siadError(e));
	}
}

function *getTransactions(action) {
	try {
		const response = yield siadCall(Siad, '/wallet/transactions?startheight=0&endheight=10000000');
		// TODO: pagination
		const transactions = parseRawTransactions(response).slice(1, 30);
		yield put(actions.setTransactions(transactions));
	} catch (e) {
		console.error(e);
		yield put(siadError(e));
	}
}

function *getNewReceiveAddress(action) {
	try {
		const response = yield siadCall(Siad, '/wallet/address');
		yield put(actions.setReceiveAddress(response.address));
		yield put(actions.showReceivePrompt());
	} catch(e) {
		console.error(e);
		yield put(siadError(e));
	}
}
// Consume any CREATE_NEW_WALLET actions
export function* watchCreateNewWallet() {
	yield *takeEvery(constants.CREATE_NEW_WALLET, createWallet);
}
// Consume any GET_LOCK_STATUS actions
export function* watchGetLockStatus() {
	yield *takeEvery(constants.GET_LOCK_STATUS, getLockStatus);
}
// Consume any UNLOCK_WALLET actions
export function* watchUnlockWallet() {
	yield *takeEvery(constants.UNLOCK_WALLET, walletUnlock);
}
// Consume any GET_BALANCE actions
export function* watchGetBalance() {
	yield *takeEvery(constants.GET_BALANCE, getBalance);
}
// Consume any GET_ADDRESSES actions
export function* watchGetAddresses() {
	yield *takeEvery(constants.GET_ADDRESSES, getAddresses);
}
export function* watchGetTransactions() {
	yield *takeEvery(constants.GET_TRANSACTIONS, getTransactions);
}
export function* watchGetNewReceiveAddress() {
	yield *takeEvery(constants.GET_NEW_RECEIVE_ADDRESS, getNewReceiveAddress);
}