import { Map, List } from 'immutable'
import * as constants from '../constants/constants.js'

const initialState = Map({
	numContracts: 0,
	storage: 0,
	earned: 0,
	expected: 0,
	walletLocked: true,
	walletsize: 0,
	defaultAnnounceAddress: '',
	files: List([]),
	modals: Map({
		resizeSize: 0,
		initialSize: 0,
		resizePath: '',
		folderPathToRemove: '',
		announceAddress: '',
		shouldShowToggleAcceptingModal: false,
	}),
})

export default function hostingReducer(state = initialState, action) {
	switch (action.type) {

	case constants.UPDATE_MODAL:
		return state.set('modals', state.get('modals').set(action.key, action.value))

	case constants.SHOW_TOGGLE_ACCEPTING_MODAL:
		return state.setIn(['modals', 'shouldShowToggleAcceptingModal'], true)

	case constants.HIDE_TOGGLE_ACCEPTING_MODAL:
		return state.setIn(['modals', 'shouldShowToggleAcceptingModal'], false)

	case constants.HIDE_RESIZE_DIALOG:
		return state.setIn(['modals', 'resizePath'], '')

	case constants.SHOW_RESIZE_DIALOG:
		return state.setIn(['modals', 'resizePath'], action.folder.get('path'))
			.setIn(['modals', 'resizeSize'], action.folder.get('size'))
			.setIn(['modals', 'initialSize'], action.ignoreInitial ? 0 : action.folder.get('size'))

	case constants.HIDE_ANNOUNCE_DIALOG:
		return state.setIn(['modals', 'announceAddress'], '')

	case constants.SHOW_ANNOUNCE_DIALOG:
		return state.setIn(['modals', 'announceAddress'],
			action.address || state.get('defaultAnnounceAddress'))

	case constants.UPDATE_FOLDER_TO_REMOVE:
		return state.setIn(['modals', 'folderPathToRemove'], action.folder || '')

	case constants.FETCH_DATA_SUCCESS:
		return state.merge(action.data)

	default:
		return state
	}
}
