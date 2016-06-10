import { Map } from 'immutable'
import * as constants from '../constants/files.js'

const initialState = Map({
	filename: '',
	siapath: '',
	filesize: '',
	available: false,
})

export default function fileViewReducer(state = initialState, action) {
	switch (action.type) {
	case constants.SHOW_FILE_VIEW:
		return state.set('filename', action.file.name)
                .set('siapath', action.file.siapath)
                .set('filesize', action.file.size)
                .set('available', action.file.available)
	default:
		return state
	}
}
