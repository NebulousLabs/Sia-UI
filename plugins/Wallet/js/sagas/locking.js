import { takeLatest } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import { getSiadWallet } from './helpers.js'
import * as actions from '../actions/locking.js'
import * as constants from '../constants/locking.js'
import Siad from 'sia.js'
const IPC = require('electron').ipcRenderer;

// Asynchronously get Siad's wallet status, and elegantly handle any side effects
function *getLockStatus(action) {
	try {
		// Sync up Siad config with the main UI.
		const config = yield call(IPC.sendSync, 'config', 'siad');
		yield Siad.configure(config);
		const response = yield getSiadWallet(Siad);
		if (!response.unlocked) {
			yield put(actions.lockWallet());
		} else {
			yield put(actions.unlockWallet());
		}
	} catch (e) {
		yield put(actions.walletError(e));
	}
}
// Consume any GET_LOCK_STATUS actions
export function* watchGetLockStatus() {
	yield *takeLatest(constants.GET_LOCK_STATUS, getLockStatus);
}