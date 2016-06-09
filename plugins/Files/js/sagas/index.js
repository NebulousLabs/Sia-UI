import * as sagas from './files.js'
import { fork } from 'redux-saga/effects'

export default function* rootSaga() {
	yield [
		fork(sagas.watchGetWalletLockstate),
		fork(sagas.watchGetFiles),
		fork(sagas.watchSetAllowance),
		fork(sagas.watchGetMetrics),
		fork(sagas.watchGetWalletBalance),
		fork(sagas.watchStorageSizeChange),
		fork(sagas.watchSetAllowanceProgress),
		fork(sagas.watchSetPath),
		fork(sagas.watchSetSearchText),
		fork(sagas.watchUploadFile),
	]
}
