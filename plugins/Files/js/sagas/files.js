import { takeEvery } from 'redux-saga'
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

function *getWalletLockstateSaga(action) {
	try {
		const response = yield siadCall('/wallet')
		yield put(actions.setWalletLockstate(response.unlocked))
	} catch (e) {
		sendError(e)
	}
}

export function* watchGetWalletLockstate() {
	yield *takeEvery(constants.GET_WALLET_LOCKSTATE, getWalletLockstateSaga)
}
