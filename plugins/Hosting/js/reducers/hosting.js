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
	defaultAnnounceAddress: '',
	modals: Map({
		shouldShowResizeDialog: false,
		resizePath: '',
		resizeSize: 0,
		initialSize: 0,
		warningModalTitle: '',
		warningModalMessage: '',
		shouldShowWarningModal: false,
		shouldShowAnnounceDialog: false,
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

	case constants.TOGGLE_ACCEPTING:
		return state.set('acceptingContracts', !state.get('acceptingContracts'))

	case constants.HIDE_RESIZE_DIALOG:
		return state.set('modals', state.get('modals').set('shouldShowResizeDialog', false))

	case constants.SHOW_RESIZE_DIALOG:
		return state.set('modals', state.get('modals')
			.set('shouldShowResizeDialog', true)
			.set('resizePath', action.folder.get('path'))
			.set('resizeSize', action.folder.get('size'))
			.set('initialSize', action.ignoreInitial ? 0 : action.folder.get('size')))

	case constants.HIDE_ANNOUNCE_DIALOG:
		return state.set('modals', state.get('modals').set('shouldShowAnnounceDialog', false))

	case constants.SHOW_ANNOUNCE_DIALOG:
		return state.set('modals', state.get('modals')
			.set('shouldShowAnnounceDialog', true)
			.set('announceAddress', action.address || state.get('defaultAnnounceAddress')))

	case constants.HIDE_WARNING_MODAL:
		return state.set('modals', state.get('modals').set('shouldShowWarningModal', false))

	case constants.SHOW_WARNING_MODAL:
		return state.set('modals', state.get('modals')
			.set('shouldShowWarningModal', true)
			.set('warningModalTitle', action.modal.get('title'))
			.set('warningModalMessage', action.modal.get('message')))

	case constants.FETCH_DATA_SUCCESS:
		return state.set('usersettings', action.ignoreSettings
				? state.get('usersettings') : action.data.get('usersettings'))
			.set('defaultsettings', state.get('defaultsettings') === undefined
				? action.data.get('usersettings') : state.get('defaultsettings'))
			.set('settingsChanged', action.ignoreSettings ? state.get('settingsChanged') : false)
			.set('acceptingContracts', action.data.get('acceptingContracts'))
			.set('numContracts', action.data.get('numContracts'))
			.set('storage', action.data.get('storage'))
			.set('earned', action.data.get('earned'))
			.set('expected', action.data.get('expected'))
			.set('files', action.data.get('files'))
			.set('walletLocked', action.data.get('walletLocked'))
			.set('defaultAnnounceAddress', action.data.get('defaultAnnounceAddress'))

	default:
		return state
	}
}
