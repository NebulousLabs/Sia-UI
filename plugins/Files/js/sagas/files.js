import { takeEvery } from 'redux-saga'
import { put } from 'redux-saga/effects'
import * as actions from '../actions/files.js'
import * as constants from '../constants/files.js'

const sendError = (e) => {
	SiaAPI.showError({
		title: 'Sia-UI Files Error',
		content: e.toString(),
	})
}

// siadCall: promisify Siad API calls.  Resolve the promise with `response` if the call was successful,
// otherwise reject the promise with `err`.
const siadCall = (uri) => new Promise((resolve, reject) => {
	SiaAPI.call(uri, (err, response) => {
		if (err) {
			reject(err)
		} else {
			resolve(response)
		}
	})
})

function* getWalletLockstateSaga() {
	try {
		const response = yield siadCall('/wallet')
		yield put(actions.setWalletLockstate(response.unlocked))
	} catch (e) {
		sendError(e)
	}
}

function* getFilesSaga() {
	try {
		const response = yield siadCall('/renter/files')
		yield put(actions.setFiles(response.files))
	} catch (e) {
		sendError(e)
	}
}

function* getAllowanceSaga() {
	try {
		const allowance = yield siadCall('/renter/allowance')
		yield put(actions.receiveAllowance(allowance))
	} catch (e) {
		sendError(e)
	}
}

export function* watchGetWalletLockstate() {
	yield *takeEvery(constants.GET_WALLET_LOCKSTATE, getWalletLockstateSaga)
}
export function* watchGetFiles() {
	yield *takeEvery(constants.GET_FILES, getFilesSaga)
}
export function* watchGetAllowance() {
	yield *takeEvery(constants.GET_ALLOWANCE, getAllowanceSaga)
}
