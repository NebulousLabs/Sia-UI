import { Map } from 'immutable'
import * as constants from '../constants/constants.js'

const initialState = Map({
	maxduration: 0,
	collateral: 0,
	storageprice: 0,
	downloadbandwidthprice: 0,
	acceptingContracts: false,
	defaultsettings: undefined,
	settingsChanged: false,
})

export default function settingsReducer(state = initialState, action) {
	switch (action.type) {

	case constants.UPDATE_SETTINGS:
		return state.merge(action.settings).set('settingsChanged', true)

	case constants.UPDATE_DURATION:
		return state.set('maxduration', action.get('newval'))
			.set('settingsChanged', true)

	case constants.UPDATE_COLLATERAL:
		return state.set('collateral', action.get('newval'))
			.set('settingsChanged', true)

	case constants.UPDATE_STORAGE_PRICE:
		return state.set('storageprice', action.get('newval'))
			.set('settingsChanged', true)

	case constants.UPDATE_DOWNLOAD_PRICE:
		return state.set('downloadbandwidthprice', action.get('newval'))
			.set('settingsChanged', true)

	case constants.UPDATE_DEFAULT_SETTINGS:
		return state.set('defaultsettings', action.get('newval'))

	case constants.FETCH_DATA_SUCCESS:
		return (action.settings === undefined ? state : state.merge(action.settings))
			.set('defaultsettings', state.get('defaultsettings') === undefined
				? action.settings : state.get('defaultsettings'))
			.set('settingsChanged', action.settings === undefined ? state.get('settingsChanged') : false)

	default:
		return state
	}
}

