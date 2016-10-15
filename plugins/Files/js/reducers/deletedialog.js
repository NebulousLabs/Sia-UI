import { Map, List } from 'immutable'
import * as constants from '../constants/files.js'

const initialState = Map({
	files: List(),
})

export default function deletedialogReducer(state = initialState, action) {
	switch (action.type) {
	case constants.SHOW_DELETE_DIALOG:
		return state.set('files', action.files)
	default:
		return state
	}
}
