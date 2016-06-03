import * as sagas from './wallet.js'
import { fork } from 'redux-saga/effects'

export default function* rootSaga() {
	yield [
		fork(sagas.watchGetWalletLockstate),
	]
}
