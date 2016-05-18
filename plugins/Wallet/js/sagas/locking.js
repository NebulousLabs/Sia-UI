import { takeLatest, takeEvery } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import { getSiadWallet } from './helpers.js';
import * as actions from '../actions/locking.js';
import * as constants from '../constants/locking.js';
import { siadError } from '../actions/error.js';
import Siad from 'sia.js'
const IPC = require('electron').ipcRenderer;

// Asynchronously get Siad's wallet status, and elegantly handle any side effects
function *getLockStatus(action) {
	try {
		// Sync up Siad config with the main UI.
		const config = yield call(IPC.sendSync, 'config', 'siad');
		yield Siad.configure(config);
		// Request /wallet from the Siad API.
		const response = yield getSiadWallet(Siad);
		if (!response.unlocked) {
			yield put(actions.setLocked());
		} else {
			yield put(actions.setUnlocked());
		}
	} catch (e) {
		// The only function that throws in this saga is getSiadWallet, so yield a siadError if an error is thrown.
		yield put(siadError(e));
	}
}
function *passwordPrompt(action) {
	try {

	} catch (e) {

	}
}
// Consume any GET_LOCK_STATUS action
export function* watchGetLockStatus() {
	yield *takeEvery(constants.GET_LOCK_STATUS, getLockStatus);
}
// Consume the latest START_PASSWORD_PROMPT action
export function* watchStartPasswordPrompt() {
	yield *takeLatest(constants.START_PASSWORD_PROMPT, passwordPrompt);
}