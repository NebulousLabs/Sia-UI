import { OrderedMap } from 'immutable'
import * as constants from '../constants/files.js'

const initialState = OrderedMap()

export default function downloadListReducer(state = initialState, action) {
	switch (action.type) {
	case constants.ADD_DOWNLOAD:
		return state.set(action.download.siapath, action.download)

	case constants.REMOVE_DOWNLOAD:
		return state.delete(action.siapath)
	default:
		return state
	}
}
