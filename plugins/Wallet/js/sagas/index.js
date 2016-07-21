import * as sagas from './wallet.js'
import { fork } from 'redux-saga/effects'

export default function* rootSaga() {
	const watchers = Object.values(sagas).map(fork)
	yield watchers
}
