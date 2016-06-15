import { takeEvery } from 'redux-saga'
import { put, take, fork, cancel } from 'redux-saga/effects'
import Path from 'path'
import * as actions from '../actions/files.js'
import * as constants from '../constants/files.js'
import BigNumber from 'bignumber.js'
import { List } from 'immutable'
import fs from 'fs'
import { sendError, siadCall, parseDownloads, parseUploads, estimatedStoragePriceGBSC } from './helpers.js'

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
function* getFilesSaga() {
	try {
		const response = yield siadCall('/renter/files')
		yield put(actions.receiveFiles(List(response.files)))
	} catch (e) {
		sendError(e)
	}
}

// Set the user's renter allowance.
function* setAllowanceSaga(action) {
	try {
		const response = yield siadCall('/renter/allowance')
		const newAllowance = SiaAPI.siacoinsToHastings(action.funds).add(response.funds)
		yield siadCall({
			url: '/renter/allowance',
			method: 'POST',
			qs: {
				funds: newAllowance.toString(),
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

// recursively version of readdir
const readdirRecursive = (path, files) => {
	const dirfiles = fs.readdirSync(path)
	let filelist
	if (typeof files === 'undefined') {
		filelist = List()
	} else {
		filelist = files
	}
	dirfiles.forEach((file) => {
		const filepath = Path.join(path, file)
		const stat = fs.statSync(filepath)
		if (stat.isDirectory()) {
			filelist = readdirRecursive(filepath, filelist)
		} else if (stat.isFile()) {
			filelist = filelist.push(filepath)
		}
	})
	return filelist
}

// Recursively upload the folder at the directory `source`
function *uploadFolderSaga(action) {
	try {
		const files = readdirRecursive(action.source)
		const folderName = Path.basename(action.source)
		const siafiles = files.map((file) => ({
			siapath: file.substring(file.indexOf(folderName), file.lastIndexOf(Path.basename(file))),
			source: file,
		}))
		for (let i = 0; i < siafiles.size; i++) {
			yield put(actions.uploadFile(siafiles.get(i).siapath, siafiles.get(i).source))
		}
	} catch (e) {
		console.error(e)
		sendError(e)
	}
}

function* downloadFileSaga(action) {
	const name = Path.basename(action.siapath)
	const download = {
		name,
		siapath: action.siapath,
		downloadpath: action.downloadpath,
		progress: 0,
		state: 'init',
	}
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
export function* watchGetMetrics() {
	yield *takeEvery(constants.GET_METRICS, getMetricsSaga)
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
