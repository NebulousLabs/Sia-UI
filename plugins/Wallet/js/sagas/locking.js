import { takeLatest, takeEvery } from 'redux-saga';
import { call, put, take } from 'redux-saga/effects';
import { siadCall } from './helpers.js';
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
		yield put(actions.setUnlocked());
	} catch (e) {
		yield put(walletUnlockError(e));
	}
}
// Consume any GET_LOCK_STATUS actions
export function* watchGetLockStatus() {
	yield *takeEvery(constants.GET_LOCK_STATUS, getLockStatus);
}
// Consume any UNLOCK_WALLET actions
export function* watchUnlockWallet() {
	yield *takeEvery(constants.UNLOCK_WALLET, walletUnlock);
}