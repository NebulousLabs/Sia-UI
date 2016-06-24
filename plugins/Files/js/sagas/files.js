import { takeEvery } from 'redux-saga'
import { put, take, fork, cancel } from 'redux-saga/effects'
import Path from 'path'
import * as actions from '../actions/files.js'
import * as constants from '../constants/files.js'
import { List } from 'immutable'
import { sendError, siadCall, totalUsage, readdirRecursive, parseDownloads, parseUploads, estimatedStoragePriceGBSC } from './helpers.js'

const blockMonth = 4320
const allowanceMonths = 0.1
const allowanceHosts = 24
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
function* getFilesSaga() {
	try {
		const response = yield siadCall('/renter/files')
		const files = List(response.files)
		yield put(actions.receiveFiles(files))
		yield put(actions.receiveDiskUsage(totalUsage(files)))
	} catch (e) {
		sendError(e)
	}
}

// Set the user's renter allowance.
function* setAllowanceSaga(action) {
	try {
		const response = yield siadCall('/renter')
		const newAllowance = SiaAPI.siacoinsToHastings(action.funds).add(response.settings.allowance.funds)
		yield siadCall({
			url: '/renter',
			method: 'POST',
			qs: {
				funds: newAllowance.toString(),
				hosts: allowanceHosts,
				period: allowancePeriod,
			},
		})
		yield put(actions.setAllowanceCompleted())
		yield put(actions.closeAllowanceDialog())
	} catch (e) {
		sendError(e)
		yield put(actions.setAllowanceCompleted())
		yield put(actions.closeAllowanceDialog())
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
		yield put(actions.setStorageSize(''))
		yield put(actions.setStorageCost('0'))
		yield put(actions.closeAllowanceDialog())
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
		if (!response.contracts) {
			return
		}
		const initialContracts = response.contracts.length
		while (true) {
			response = yield siadCall('/renter/contracts')
			const deltaContracts = response.contracts.length - initialContracts
			if (deltaContracts >= allowanceHosts) {
				break
			}
			const progress = Math.floor((deltaContracts / allowanceHosts) * 100)
			yield put(actions.setAllowanceProgress(progress))
			yield delay(500)
		}
	} catch (e) {
		sendError(e)
	}
}

function* uploadFileSaga(action) {
	try {
		const filename = Path.basename(action.source)
		const destpath = action.siapath + filename
		yield siadCall({
			url: '/renter/upload/' + destpath,
			method: 'POST',
			qs: {
				source: action.source,
			},
		})
	} catch (e) {
		sendError(e)
	}
}

// Recursively upload the folder at the directory `source`
function *uploadFolderSaga(action) {
	try {
		const files = readdirRecursive(action.source)
		const folderName = Path.basename(action.source)
		const uploads = files.map((file) => ({
			siapath: file.substring(file.indexOf(folderName), file.lastIndexOf(Path.basename(file))),
			source: file,
		})).map((file) => actions.uploadFile(file.siapath, file.source))

		for (const upload in uploads.toArray()) {
			yield put(uploads.get(upload))
		}
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
	} catch (e) {
		sendError(e)
	}
}

function* getDownloadsSaga(action) {
	try {
		const response = yield siadCall('/renter/downloads')
		const downloads = parseDownloads(action.since, response.downloads)
		yield put(actions.receiveDownloads(downloads))
	} catch (e) {
		sendError(e)
	}
}

function* getUploadsSaga() {
	try {
		const response = yield siadCall('/renter/files')
		const uploads = parseUploads(response.files)
		yield put(actions.receiveUploads(uploads))
	} catch (e) {
		sendError(e)
	}
}

function* deleteFileSaga(action) {
	try {
		yield siadCall({
			url: '/renter/delete/' + action.siapath,
			method: 'POST',
		})
		yield put(actions.getFiles())
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
export function* watchGetUploads() {
	yield *takeEvery(constants.GET_UPLOADS, getUploadsSaga)
}
export function* watchGetWalletLockstate() {
	yield *takeEvery(constants.GET_WALLET_LOCKSTATE, getWalletLockstateSaga)
}
export function* watchGetFiles() {
	yield *takeEvery(constants.GET_FILES, getFilesSaga)
}
export function* watchDeleteFile() {
	yield *takeEvery(constants.DELETE_FILE, deleteFileSaga)
}
export function* watchGetWalletBalance() {
	yield *takeEvery(constants.GET_WALLET_BALANCE, getWalletBalanceSaga)
}
export function* watchUploadFolder() {
	yield *takeEvery(constants.UPLOAD_FOLDER, uploadFolderSaga)
}
export function* watchCalculateStorageCost() {
	yield *takeEvery(constants.CALCULATE_STORAGE_COST, calculateStorageCostSaga)
}
export function* watchUploadFile() {
	yield *takeEvery(constants.UPLOAD_FILE, uploadFileSaga)
}
export function* watchDownloadFile() {
	yield *takeEvery(constants.DOWNLOAD_FILE, downloadFileSaga)
}
