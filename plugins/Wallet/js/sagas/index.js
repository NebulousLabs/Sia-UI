import * as sagas from './wallet.js'
import { fork } from 'redux-saga/effects'

export default function* rootSaga() {
	yield [
		fork(sagas.watchGetLockStatus),
		fork(sagas.watchUnlockWallet),
		fork(sagas.watchCreateNewWallet),
		fork(sagas.watchGetBalance),
		fork(sagas.watchGetTransactions),
		fork(sagas.watchGetNewReceiveAddress),
		fork(sagas.watchSendCurrency),
	]
}
