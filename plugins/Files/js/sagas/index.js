import * as sagas from './files.js'
import { fork } from 'redux-saga/effects'

export default function* rootSaga() {
	yield [
		fork(sagas.watchGetWalletLockstate),
		fork(sagas.watchGetFiles),
		fork(sagas.watchSetAllowance),
		fork(sagas.watchGetMetrics),
		fork(sagas.watchGetWalletBalance),
		fork(sagas.watchCalculateStorageCost),
		fork(sagas.watchSetAllowanceProgress),
		fork(sagas.watchUploadFile),
		fork(sagas.watchDownloadFile),
		fork(sagas.watchGetDownloads),
		fork(sagas.watchGetUploads),
		fork(sagas.watchDeleteFile),
		fork(sagas.watchUploadFolder),
	]
}
