import { Map } from 'immutable'
import * as constants from '../constants/constants.js'

const initialState = Map({
	resizeSize: 0,
	initialSize: 0,
	resizePath: '',
	folderPathToRemove: '',
	announceAddress: undefined,
	defaultAnnounceAddress: '',
	shouldShowToggleAcceptingModal: false,
})

export default function modalReducer(state = initialState, action) {
	switch (action.type) {
	case constants.UPDATE_MODAL:
		return state.set(action.key, action.value)

	case constants.SHOW_TOGGLE_ACCEPTING_MODAL:
		return state.set('shouldShowToggleAcceptingModal', true)

	case constants.HIDE_TOGGLE_ACCEPTING_MODAL:
		return state.set('shouldShowToggleAcceptingModal', false)

	case constants.SHOW_RESIZE_DIALOG:
		return state.set('resizePath', action.folder.get('path'))
			.set('resizeSize', action.folder.get('size'))
			.set('initialSize', action.ignoreInitial ? 0 : action.folder.get('size'))

	case constants.HIDE_RESIZE_DIALOG:
		return state.set('resizePath', '')

	case constants.HIDE_ANNOUNCE_DIALOG:
		return state.set('announceAddress', undefined)

	case constants.SHOW_ANNOUNCE_DIALOG:
		return state.set('announceAddress',
			action.address || state.get('defaultAnnounceAddress'))

	case constants.UPDATE_FOLDER_TO_REMOVE:
		return state.set('folderPathToRemove', action.folder || '')

	case constants.FETCH_DATA_SUCCESS:
		return state.merge(action.modals)

	default:
		return state
	}
}
