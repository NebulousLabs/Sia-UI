import { Map } from 'immutable'
import * as constants from '../constants/constants.js'

const initialState = Map({
	maxduration: 0,
	collateral: 0,
	storageprice: 0,
	downloadbandwidthprice: 0,
	acceptingContracts: false,
	defaultsettings: Map(),
	settingsChanged: false,
})

export default function settingsReducer(state = initialState, action) {
	switch (action.type) {
	case constants.UPDATE_SETTINGS:
		return state.merge(action.settings)
		            .set('settingsChanged', true)
	case constants.PUSH_SETTINGS:
		return state.set('defaultsettings', action.settings)
		            .set('settingsChanged', false)
	case constants.RECEIVE_DEFAULT_SETTINGS:
		return state.set('defaultsettings', action.settings)
		            .merge(action.settings)
	case constants.FETCH_DATA_SUCCESS:
		return state.get('settingsChanged') ? state : state.merge(action.settings)
	default:
		return state
	}
}

