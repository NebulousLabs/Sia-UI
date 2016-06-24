import { Map, List } from 'immutable'
import * as constants from '../constants/constants.js'

const initialState = Map({
	numContracts: 0,
	storage: 0,
	usersettings: List([
		Map({ name: 'Max Duration (Weeks)', value: 0, min: 12 }),
		Map({ name: 'Collateral per TB per Month (SC)', value: 0 }),
		Map({ name: 'Price per TB per Month (SC)', value: 0 }),
		Map({ name: 'Bandwidth Price (SC/TB)', value: 0 }),
	]),
	defaultsettings: undefined,
	files: List([]),
	earned: 0,
	expected: 0,
	acceptingContracts: 0,
	settingsChanged: false,
	walletLocked: true,
	walletsize: 0,
	defaultAnnounceAddress: '',
	modals: Map({
		resizePath: '',
		resizeSize: 0,
		initialSize: 0,
		folderToRemove: undefined,
		shouldShowAnnounceDialog: false,
		shouldShowToggleAcceptingModal: false,
		shouldShowResizeDialog: false,
		announceAddress: '',
	}),
})

export default function hostingReducer(state = initialState, action) {
	switch (action.type) {
	case constants.UPDATE_SETTING:
		let settingslist = state.get('usersettings')
		settingslist = settingslist.map((value) => (
			(value.get('name') === action.setting) ?
				value.set('value', action.value)
			: value
		))
		return state.set('usersettings', settingslist).set('settingsChanged', true)

	case constants.UPDATE_MODAL:
		return state.set('modals', state.get('modals').set(action.key, action.value))

	case constants.SHOW_TOGGLE_ACCEPTING_MODAL:
		return state.setIn(['modals', 'shouldShowToggleAcceptingModal'], true)

	case constants.HIDE_TOGGLE_ACCEPTING_MODAL:
		return state.setIn(['modals', 'shouldShowToggleAcceptingModal'], false)

	case constants.HIDE_RESIZE_DIALOG:
		return state.setIn(['modals', 'shouldShowResizeDialog'], false)

	case constants.SHOW_RESIZE_DIALOG:
		return state.setIn(['modals', 'shouldShowResizeDialog'], true)
			.setIn(['modals', 'resizePath'], action.folder.get('path'))
			.setIn(['modals', 'resizeSize'], action.folder.get('size'))
			.setIn(['modals', 'initialSize'], action.ignoreInitial ? 0 : action.folder.get('size'))

	case constants.HIDE_ANNOUNCE_DIALOG:
		return state.set('modals', state.get('modals').set('shouldShowAnnounceDialog', false))

	case constants.SHOW_ANNOUNCE_DIALOG:
		return state.set('modals', state.get('modals')
			.set('shouldShowAnnounceDialog', true)
			.set('announceAddress', action.address || state.get('defaultAnnounceAddress')))

	case constants.UPDATE_FOLDER_TO_REMOVE:
		return state.setIn(['modals', 'folderToRemove'], action.folder)

	case constants.FETCH_DATA_SUCCESS:
		return state.mergeWith((old, newer, key) => (key === 'usersettings' && action.ignoreSettings)
			? old : newer, action.data)
			.set('settingsChanged', action.ignoreSettings ? state.get('settingsChanged') : false)
			.set('defaultsettings', state.get('defaultsettings') === undefined
				? action.data.get('usersettings') : state.get('defaultsettings'))

	default:
		return state
	}
}
