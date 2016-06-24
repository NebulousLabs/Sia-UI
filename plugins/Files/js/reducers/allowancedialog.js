import { Map } from 'immutable'
import * as constants from '../constants/files.js'

const initialState = Map({
	storageSize: '',
	storageCost: '0',
	allowanceProgress: 0,
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
	case constants.SET_ALLOWANCE_COMPLETED:
		return state.set('settingAllowance', false)
	case constants.SET_ALLOWANCE_PROGRESS:
		return state.set('allowanceProgress', action.progress)
	default:
		return state
	}
}
