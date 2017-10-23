import { takeEvery, delay } from 'redux-saga'
import { fork, join, put, race, take, call } from 'redux-saga/effects'
import Path from 'path'
import fs from 'graceful-fs'
import * as actions from '../actions/files.js'
import * as constants from '../constants/files.js'
import { List } from 'immutable'
import BigNumber from 'bignumber.js'
import { ls, uploadDirectory, sendError, allowancePeriod, readableFilesize, siadCall, readdirRecursive, parseDownloads, parseUploads } from './helpers.js'

// Query siad for the state of the wallet.
// dispatch `unlocked` in receiveWalletLockstate
function* getWalletLockstateSaga() {
	try {
		const response = yield siadCall('/wallet')
		yield put(actions.receiveWalletLockstate(response.unlocked))
	} catch (e) {
		console.error('error fetching wallet lock state: ' + e.toString())
	}
}

// Query siad for the sync state of the wallet.
function* getWalletSyncstateSaga() {
	try {
		const response = yield siadCall('/consensus')
		yield put(actions.setWalletSyncstate(response.synced))
	} catch (e) {
		console.error('error fetching wallet sync state: ' + e.toString())
	}
}

// Query siad for the user's files.
function* getFilesSaga() {
	try {
		const response = yield siadCall('/renter/files')
		const files = List(response.files)
		yield put(actions.receiveFiles(files))
	} catch (e) {
		console.error('error fetching files: ' + e.toString())
	}
}

function* getStorageEstimateSaga(action) {
	try {
		const response = yield siadCall('/renter/prices')
		if (response.storageterabytemonth === '0') {
			yield put(actions.setStorageEstimate('No Hosts'))
			return
		}
		const estimate = new BigNumber(SiaAPI.siacoinsToHastings(action.funds)).dividedBy(response.storageterabytemonth).times(1e12)

		yield put(actions.setStorageEstimate('~' + readableFilesize(estimate.toPrecision(1))))
		yield put(actions.setFeeEstimate(SiaAPI.hastingsToSiacoins(response.formcontracts).toString()))
	} catch (e) {
		console.error(e)
	}
}

// Get the renter's current allowance and spending.
function* getAllowanceSaga() {
	try {
		const response = yield siadCall('/renter')
		const allowance = SiaAPI.hastingsToSiacoins(response.settings.allowance.funds)
		const downloadspending = SiaAPI.hastingsToSiacoins(response.financialmetrics.downloadspending)
		const uploadspending = SiaAPI.hastingsToSiacoins(response.financialmetrics.uploadspending)
		const contractspending = SiaAPI.hastingsToSiacoins(response.financialmetrics.contractspending)
		const storagespending = SiaAPI.hastingsToSiacoins(response.financialmetrics.storagespending)
		const unspent = SiaAPI.hastingsToSiacoins(response.financialmetrics.unspent)

		const consensus = yield siadCall('/consensus')
		const renewheight = (() => {
			if (response.settings.allowance.renewwindow === 0) {
				return 0
			}
			return response.settings.allowance.renewwindow + consensus.height
		})()

		yield put(actions.receiveAllowance(allowance.round(0).toNumber()))
		yield put(actions.receiveSpending(downloadspending.round(2).toNumber(), uploadspending.round(2).toNumber(), storagespending.round(2).toNumber(), contractspending.round(2).toNumber(), unspent.round(2).toNumber(), renewheight))
	} catch (e) {
		console.error('error getting allowance: ' + e.toString())
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
			timeout: 7.2e6, // 120 minute timeout for setting allowance
			qs: {
				funds: newAllowance.toString(),
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
		console.error('error fetching wallet balance: ' + e.toString())
	}
}

// UploadFileSaga uploads a file to the Sia network.
// action.siapath: the working directory to upload the file to
// action.source: the path to the file to upload.
// The full siapath is computed as Path.join(action.siapath, Path.basename(action.source))
function* uploadFileSaga(action) {
	try {
		const filename = Path.basename(action.source)
		const destpath = Path.posix.join(action.siapath, filename)
		yield siadCall({
			url: '/renter/upload/' + encodeURI(destpath),
			timeout: 20000, // 20 second timeout for upload calls
			method: 'POST',
			qs: {
				source: action.source,
			},
		})
	} catch (e) {
		sendError(e)
	}
}

// uploadFolderSaga uploads a folder to the Sia network.
// action.source: the source path of the folder
// action.siapath: the working directory to upload the folder inside
function *uploadFolderSaga(action) {
	try {
		const files = readdirRecursive(action.source)
		const uploads = uploadDirectory(action.source, files, action.siapath)
		for (const upload in uploads.toArray()) {
			yield put(uploads.get(upload))
		}
	} catch (e) {
		sendError(e)
	}
}

function* downloadFileSaga(action) {
	try {
		if (action.file.type === 'file') {
			yield siadCall({
				url: '/renter/download/' + encodeURI(action.file.siapath),
				timeout: 6e8,
				method: 'GET',
				qs: {
					destination: action.downloadpath,
				},
			})
		}
		if (action.file.type === 'directory') {
			fs.mkdirSync(action.downloadpath)
			const response = yield siadCall('/renter/files')
			const siafiles = ls(List(response.files), action.file.siapath)
			for (const siafile in siafiles.toArray()) {
				const file = siafiles.get(siafile)
				yield put(actions.downloadFile(file, Path.join(action.downloadpath, file.name)))
				yield new Promise((resolve) => setTimeout(resolve, 300))
			}
		}
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
		console.error('error fetching downloads: ' + e.toString())
	}
}

function* getUploadsSaga() {
	try {
		const response = yield siadCall('/renter/files')
		const uploads = parseUploads(response.files)
		yield put(actions.receiveUploads(uploads))
	} catch (e) {
		console.error('error fetching uploads: ' + e.toString())
	}
}

// deleteFileSaga handles DELETE_FILE actions, which can include directories.
function* deleteFileSaga(action) {
	try {
		if (action.file.siaUIFolder) {
			yield put(actions.deleteSiaUIFolder(action.file.siapath))
		} else if (action.file.type === 'file') {
			yield siadCall({
				url: '/renter/delete/' + encodeURI(action.file.siapath),
				timeout: 3.6e6, // 60 minute timeout for deleting files
				method: 'POST',
			})
			yield put(actions.getFiles())
		} else if (action.file.type === 'directory') {
			const response = yield siadCall('/renter/files')
			const siafiles = ls(List(response.files), action.file.siapath)
			for (const siafile in siafiles.toArray()) {
				const file = siafiles.get(siafile)
				yield put(actions.deleteFile(file))
			}
		}
	} catch (e) {
		sendError(e)
	}
}

function* getContractCountSaga() {
	try {
		const response = yield siadCall('/renter/contracts')
		yield put(actions.setContractCount(response.contracts.length))
	} catch (e) {
		console.error('error getting contract count: ' + e.toString())
	}
}

function* renameFileSaga(action) {
	try {
		if (action.file.siaUIFolder) {
			yield put(actions.renameSiaUIFolder(action.file.siapath, action.newsiapath))
		} else if (action.file.type === 'file') {
			yield siadCall({
				url: '/renter/rename/' + encodeURI(action.file.siapath),
				method: 'POST',
				qs: {
					newsiapath: action.newsiapath,
				},
			})
			yield put(actions.getFiles())
		} else if (action.file.type === 'directory') {
			const directorypath = action.file.siapath
			const response = yield siadCall('/renter/files')
			const siafiles = ls(List(response.files), directorypath)
			for (const i in siafiles.toArray()) {
				const file = siafiles.get(i)
				const newfilepath = Path.posix.join(action.newsiapath, file.siapath.split(directorypath)[1])
				yield put(actions.renameFile(file, newfilepath))
			}
		}
		yield put(actions.hideRenameDialog())
	} catch (e) {
		sendError(e)
	}
}

export function* dataFetcher() {
	while (true) {
		let tasks = []
		tasks = tasks.concat(yield fork(getDownloadsSaga))
		tasks = tasks.concat(yield fork(getFilesSaga))
		tasks = tasks.concat(yield fork(getUploadsSaga))
		tasks = tasks.concat(yield fork(getContractCountSaga))
		tasks = tasks.concat(yield fork(getWalletBalanceSaga))
		tasks = tasks.concat(yield fork(getWalletSyncstateSaga))
		tasks = tasks.concat(yield fork(getWalletLockstateSaga))
		tasks = tasks.concat(yield fork(getAllowanceSaga))

		yield join(...tasks)
		yield race({
			task: call(delay, 8000),
			cancel: take(constants.FETCH_DATA),
		})
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
export function* watchGetWalletSyncstate() {
	yield *takeEvery(constants.GET_WALLET_SYNCSTATE, getWalletSyncstateSaga)
}
