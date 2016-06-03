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

// Query siad for the state of the wallet.
// dispatch `unlocked` in receiveWalletLockstate
function* getWalletLockstateSaga() {
	try {
		const response = yield siadCall('/wallet')
		yield put(actions.receiveWalletLockstate(response.unlocked))
	} catch (e) {
		sendError(e)
	}
}

// Query siad for the user's files.
function* getFilesSaga() {
	try {
		const response = yield siadCall('/renter/files')
		yield put(actions.receiveFiles(response.files))
	} catch (e) {
		sendError(e)
	}
}

// Query siad for the user's allowance.
function* getAllowanceSaga() {
	try {
		const allowance = yield siadCall('/renter/allowance')
		yield put(actions.receiveAllowance(allowance))
	} catch (e) {
		sendError(e)
	}
}

// Set the user's renter allowance.
function* setAllowanceSaga(action) {
	try {
		yield siadCall({
			url: '/renter/allowance',
			method: 'POST',
			qs: {
				funds: action.allowance.funds,
				hosts: action.allowance.hosts,
				period: action.allowance.period,
				renewwindow: action.allowance.renewwindow,
			},
		})
		yield put(actions.receiveAllowance(action.allowance))
	} catch (e) {
		sendError(e)
	}
}

export function* watchSetAllowance() {
	yield *takeEvery(constants.SET_ALLOWANCE, setAllowanceSaga)
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
