import { Map } from 'immutable'
import * as constants from '../constants/files.js'

const initialState = Map({
	siapath: '',
})

export default function deletedialogReducer(state = initialState, action) {
	switch (action.type) {
	case constants.SHOW_DELETE_DIALOG:
		return state.set('siapath', action.siapath)
	default:
		return state
	}
}
