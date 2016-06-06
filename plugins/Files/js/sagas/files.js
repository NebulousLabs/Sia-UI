import { takeEvery } from 'redux-saga'
import { put } from 'redux-saga/effects'
import * as actions from '../actions/files.js'
import * as constants from '../constants/files.js'
import BigNumber from 'bignumber.js'
import { sendError, siadCall, parseFiles } from './helpers.js'

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
		yield put(actions.receiveFiles(parseFiles(response.files)))
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

// Query siad for renter metrics.
function* getMetricsSaga() {
	try {
		const response = yield siadCall('/renter')
		const downloadspending = new BigNumber(response.financialmetrics.downloadspending)
		const uploadspending = new BigNumber(response.financialmetrics.uploadspending)
		const storagespending = new BigNumber(response.financialmetrics.storagespending)

		const allocatedspending = SiaAPI.hastingsToSiacoins(response.financialmetrics.contractspending).round(2).toString()
		const activespending = SiaAPI.hastingsToSiacoins(downloadspending.plus(uploadspending).plus(storagespending)).round(2).toString()

		yield put(actions.receiveMetrics(activespending, allocatedspending))
	} catch (e) {
		sendError(e)
	}
}
// Query Siad for the current wallet balance.
function* getWalletBalanceSaga() {
	try {
		const response = yield siadCall('/wallet')
		const confirmedBalance = SiaAPI.hastingsToSiacoins(response.confirmedsiacoinbalance).round(2).toString()
		yield put(actions.receiveWalletBalance(confirmedBalance))
	} catch (e) {
		sendError(e)
	}
}

// NAIVE HARDCODED STORAGE COST CALCULATION FOR TESTING
// pending david's actual cost calculation algorithm

const scPerTBPerMo = new BigNumber(10000)
const GBperTB = new BigNumber(1000)

// Calculate monthly storage cost from a requested monthly storage amount
function* calculateStorageCostSaga(action) {
	try {
		const sizeGB = new BigNumber(action.size)
		const sizeTB = sizeGB.dividedBy(GBperTB)
		const cost = sizeTB.times(scPerTBPerMo).round(2).toString()
		yield put(actions.setStorageCost(cost))
	} catch (e) {
		yield put(actions.setStorageCost(''))
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
export function* watchGetMetrics() {
	yield *takeEvery(constants.GET_METRICS, getMetricsSaga)
}
export function* watchGetWalletBalance() {
	yield *takeEvery(constants.GET_WALLET_BALANCE, getWalletBalanceSaga)
}
export function* watchStorageSizeChange() {
	yield *takeEvery(constants.HANDLE_STORAGE_SIZE_CHANGE, calculateStorageCostSaga)
}
