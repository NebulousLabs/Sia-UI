import { Map } from 'immutable'
import * as constants from '../constants/files.js'

const initialState = Map({
	siapath: '',
})

export default function renamedialogReducer(state = initialState, action) {
	switch (action.type) {
	case constants.SHOW_RENAME_DIALOG:
		return state.set('siapath', action.siapath)
	default:
		return state
	}
}
