import { Map } from 'immutable'
import * as constants from '../constants/files.js'

const initialState = Map({
	storageSize: '',
	storageCost: '0',
	settingAllowance: false,
})

export default function allowanceDialogReducer(state = initialState, action) {
	switch (action.type) {
	case constants.SET_STORAGE_SIZE:
		return state.set('storageSize', action.size)
	case constants.SET_STORAGE_COST:
		return state.set('storageCost', action.cost)
	case constants.SET_ALLOWANCE:
		return state.set('settingAllowance', true)
	case constants.RECEIVE_ALLOWANCE:
		return state.set('settingAllowance', false)
	default:
		return state
	}
}
