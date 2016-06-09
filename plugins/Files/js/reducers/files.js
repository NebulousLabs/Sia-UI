import { Map, List } from 'immutable'
import * as constants from '../constants/files.js'

const initialState = Map({
	activespending: '',
	allocatedspending: '',
	files: List(),
	path: '',
	searchText: '',
	showAllowanceDialog: false,
})

export default function filesReducer(state = initialState, action) {
	console.log(action)
	switch (action.type) {
	case constants.RECEIVE_METRICS:
		return state.set('activespending', action.activespending)
		            .set('allocatedspending', action.allocatedspending)
	case constants.RECEIVE_FILES:
		return state.set('files', action.files)
	case constants.SHOW_ALLOWANCE_DIALOG:
		return state.set('showAllowanceDialog', true)
	case constants.CLOSE_ALLOWANCE_DIALOG:
		return state.set('showAllowanceDialog', false)
	case constants.SET_PATH:
		return state.set('path', action.path)
	case constants.SET_SEARCH_TEXT:
		return state.set('searchText', action.text)
	default:
		return state
	}
}
