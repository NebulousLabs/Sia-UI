import { takeEvery } from 'redux-saga'
import { put } from 'redux-saga/effects'
import Path from 'path'
import * as actions from '../actions/files.js'
import * as constants from '../constants/files.js'
import { List } from 'immutable'
import { allowancePeriod, allowanceHosts, estimatedStorage, totalSpending, sendError, siadCall, readdirRecursive, parseDownloads, parseUploads } from './helpers.js'


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
	} catch (e) {
		sendError(e)
	}
}

function* getStorageEstimateSaga(action) {
	try {
		const response = yield siadCall('/hostdb/active')
		const estimate = estimatedStorage(SiaAPI.siacoinsToHastings(action.funds), response.hosts)
		yield put(actions.setStorageEstimate(estimate))
	} catch (e) {
		console.error(e)
	}
}

// Get the renter's current allowance and spending.
function* getAllowanceSaga() {
	try {
		let response = yield siadCall('/renter')
		const allowance = SiaAPI.hastingsToSiacoins(response.settings.allowance.funds)

		response = yield siadCall('/renter/contracts')
		const contracts = response.contracts

		const spendingSC = totalSpending(allowance, contracts)
		yield put(actions.receiveAllowance(allowance.round(0).toString()))
		yield put(actions.receiveSpending(spendingSC.round(0).toString()))
	} catch (e) {
		console.error(e)
	}
}

// Set the user's renter allowance.
function* setAllowanceSaga(action) {
	try {
		const newAllowance = SiaAPI.siacoinsToHastings(action.funds)
		yield put(actions.closeAllowanceDialog())
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
	} catch (e) {
		sendError(e)
		yield put(actions.setAllowanceCompleted())
		yield put(actions.closeAllowanceDialog())
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

// UploadFileSaga uploads a file to the Sia network.
// action.siapath: the working directory to upload the file to
// action.source: the path to the file to upload.
// The full siapath is computed as Path.join(action.siapath, Path.basename(action.source))
function* uploadFileSaga(action) {
	try {
		const filename = Path.basename(action.source)
		const destpath = Path.join(action.siapath, filename)
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
			siapath: Path.join(action.siapath, file.substring(file.indexOf(folderName), file.lastIndexOf(Path.basename(file)))),
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

function* getDownloadsSaga() {
	try {
		const response = yield siadCall('/renter/downloads')
		const downloads = parseDownloads(response.downloads)
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

function* getContractCountSaga() {
	try {
		const response = yield siadCall('/renter/contracts')
		yield put(actions.setContractCount(response.contracts.length))
	} catch (e) {
		sendError(e)
	}
}

function* renameFileSaga(action) {
	try {
		yield siadCall({
			url: '/renter/rename/' + action.siapath,
			method: 'POST',
			qs: {
				newsiapath: action.newsiapath,
			},
		})
		yield put(actions.getFiles())
		yield put(actions.hideRenameDialog())
	} catch (e) {
		sendError(e)
	}
}

export function* watchSetAllowance() {
	yield *takeEvery(constants.SET_ALLOWANCE, setAllowanceSaga)
}
export function* watchGetAllowance() {
	yield *takeEvery(constants.GET_ALLOWANCE, getAllowanceSaga)
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
export function* watchGetContractCount() {
	yield *takeEvery(constants.GET_CONTRACT_COUNT, getContractCountSaga)
}
export function* watchUploadFile() {
	yield *takeEvery(constants.UPLOAD_FILE, uploadFileSaga)
}
export function* watchDownloadFile() {
	yield *takeEvery(constants.DOWNLOAD_FILE, downloadFileSaga)
}
export function* watchRenameFile() {
	yield *takeEvery(constants.RENAME_FILE, renameFileSaga)
}
export function* watchGetStorageEstimate() {
	yield *takeEvery(constants.GET_STORAGE_ESTIMATE, getStorageEstimateSaga)
}
