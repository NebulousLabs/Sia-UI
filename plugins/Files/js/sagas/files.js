import { takeEvery } from 'redux-saga'
import { put, take, fork, cancel } from 'redux-saga/effects'
import Path from 'path'
import * as actions from '../actions/files.js'
import * as constants from '../constants/files.js'
import BigNumber from 'bignumber.js'
import { sendError, siadCall, parseFiles, parseUploads, parseDownloads, searchFiles, estimatedStoragePriceGBSC } from './helpers.js'

const allowanceHosts = 24
const blockMonth = 4382
const allowanceMonths = 3
const allowancePeriod = blockMonth*allowanceMonths

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
function* getFilesSaga(action) {
	try {
		const response = yield siadCall('/renter/files')
		yield put(actions.receiveFiles(parseFiles(response.files, action.path), action.path))
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
				funds: SiaAPI.siacoinsToHastings(action.funds).toString(),
				hosts: allowanceHosts,
				period: allowancePeriod,
			},
		})
		yield put(actions.setAllowanceCompleted())
		yield put(actions.getMetrics())
		yield put(actions.closeAllowanceDialog())
	} catch (e) {
		sendError(e)
	}
}

// Calculate monthly storage cost from a requested monthly storage amount
function* calculateStorageCostSaga(action) {
	try {
		const response = yield siadCall('/renter/hosts/active')
		const cost = estimatedStoragePriceGBSC(response.hosts, action.size, allowancePeriod)
		yield put(actions.setStorageCost(cost.round(3).toString()))
		yield put(actions.setStorageSize(action.size))
	} catch (e) {
		console.error(e)
		yield put(actions.setStorageSize(''))
		yield put(actions.setStorageCost('0'))
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

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

function* setAllowanceProgressBarSaga() {
	try {
		let response = yield siadCall('/renter/contracts')
		const initialContracts = response.contracts.length
		while (true) {
			response = yield siadCall('/renter/contracts')
			const deltaContracts = response.contracts.length - initialContracts
			if (deltaContracts === allowanceHosts) {
				break
			}
			const progress = Math.floor((deltaContracts / allowanceHosts) * 100)
			yield put(actions.setAllowanceProgress(progress.toString()))
			yield delay(500)
		}
	} catch (e) {
		sendError(e)
	}
}

function* setPathSaga(action) {
	try {
		yield put(actions.getFiles(action.path))
	} catch (e) {
		sendError(e)
	}
}

function* setSearchTextSaga(action) {
	try {
		if (action.text === '') {
			yield put(actions.setPath(action.path))
			return
		}
		const response = yield siadCall('/renter/files')
		yield put(actions.receiveFiles(searchFiles(response.files, action.text, action.path), action.path))
	} catch (e) {
		sendError(e)
	}
}

function* uploadFileSaga(action) {
	try {
		const filename = Path.basename(action.source)
		const destpath = action.path + filename
		yield siadCall({
			url: '/renter/upload/' + destpath,
			method: 'POST',
			qs: {
				source: action.source,
			},
		})
		yield put(actions.getFiles(action.path))
	} catch (e) {
		sendError(e)
	}
}

function* downloadFileSaga(action) {
	try {
		yield siadCall({
			url: '/renter/download/' + action.siapath,
			method: 'GET',
			qs: {
				destination: action.downloadpath,
			},
		})
		yield put(actions.getDownloads())
	} catch (e) {
		console.error(e)
		sendError(e)
	}
}

function* getDownloadsSaga() {
	try {
		const response = yield siadCall('/renter/downloads')
		const downloads = parseDownloads(response.downloads)
		yield put(actions.receiveDownloads(downloads))
	} catch (e) {
		sendError(e)
	}
}

export function* watchSetAllowance() {
	yield *takeEvery(constants.SET_ALLOWANCE, setAllowanceSaga)
}
export function* watchSetAllowanceProgress() {
	while (yield take(constants.SET_ALLOWANCE)) {
		const progressTask = yield fork(setAllowanceProgressBarSaga)
		yield take(constants.SET_ALLOWANCE_COMPLETED)
		yield cancel(progressTask)
	}
}
export function* watchGetDownloads() {
	yield *takeEvery(constants.GET_DOWNLOADS, getDownloadsSaga)
}
export function* watchSetSearchText() {
	yield *takeEvery(constants.SET_SEARCH_TEXT, setSearchTextSaga)
}
export function* watchGetWalletLockstate() {
	yield *takeEvery(constants.GET_WALLET_LOCKSTATE, getWalletLockstateSaga)
}
export function* watchGetFiles() {
	yield *takeEvery(constants.GET_FILES, getFilesSaga)
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
export function* watchSetPath() {
	yield *takeEvery(constants.SET_PATH, setPathSaga)
}
export function* watchUploadFile() {
	yield *takeEvery(constants.UPLOAD_FILE, uploadFileSaga)
}
export function* watchDownloadFile() {
	yield *takeEvery(constants.DOWNLOAD_FILE, downloadFileSaga)
}
