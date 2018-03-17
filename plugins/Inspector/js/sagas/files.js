import { takeEvery, delay } from 'redux-saga'
import { fork, join, put, race, take, call, select } from 'redux-saga/effects'
import * as actions from '../actions/files.js'
import * as constants from '../constants/files.js'
import { List } from 'immutable'
import { siadCall } from './helpers.js'

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

function* getFileDetailSaga(action) {
	let siapath, pagingNum, current

	if (action) {
		({ siapath, pagingNum, current } = action)
	} else {
		({ siapath, pagingNum, current } = yield select((state) => ({
			siapath: state.files.get('showDetailPath'), pagingNum: state.files.get('pagingNum'), current: state.files.get('current'),
		})))
		if (!siapath) {
			return
		}
	}

	try {
		const response = yield siadCall('/renter/filedetail/'
											+ encodeURI(siapath)
										    + '?pagingNum=' + pagingNum
											+ '&current=' + current)
		yield put(actions.receiveFileDetail({ pagingNum, current, file: response }))
	} catch (e) {
		console.error('error fetching file: ' + e.toString())
	}
}

export function* dataFetcher() {
	while (true) {
		let tasks = []
		tasks = tasks.concat(yield fork(getFilesSaga))
		tasks = tasks.concat(yield fork(getFileDetailSaga))

		yield join(...tasks)
		yield race({
			task: call(delay, 8000),
			cancel: take(constants.FETCH_DATA),
		})
	}
}
export function* watchGetFiles() {
	yield *takeEvery(constants.GET_FILES, getFilesSaga)
}
export function* watchGetFileDetail() {
	yield *takeEvery(constants.GET_FILE_DETAIL, getFileDetailSaga)
}
