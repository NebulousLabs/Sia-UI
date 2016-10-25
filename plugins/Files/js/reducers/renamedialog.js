import { Map } from 'immutable'
import * as constants from '../constants/files.js'

const initialState = Map({
	file: {},
})

export default function renamedialogReducer(state = initialState, action) {
	switch (action.type) {
	case constants.SHOW_RENAME_DIALOG:
		return state.set('file', action.file)
	default:
		return state
	}
}
