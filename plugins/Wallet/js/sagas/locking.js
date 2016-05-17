import { takeLatest } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import * as constants from '../constants/locking.js'
import Siad from 'sia.js'
const IPC = require('electron').ipcRenderer;

// Asynchronously get Siad's wallet status, and elegantly handle any side effects
function *getLockStatus(action) {
	try {
		// Sync up Siad config with the main UI.
		const config = IPC.sendSync('config');
		yield Siad.configure(config);
	} catch (e) {

	}
}
// Consume any GET_LOCK_STATUS actions
export function* watchGetLockStatus() {
	yield *takeLatest(constants.GET_LOCK_STATUS, getLockStatus);
}