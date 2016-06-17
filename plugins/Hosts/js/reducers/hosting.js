import { Map, List } from 'immutable'
import * as constants from '../constants/constants.js'

const initialState = Map({
	numContracts: 0,
	storage: 0,
	usersettings: List([
		Map({ name: "Max Duration (Weeks)", value: 30, min: 12 }),
		Map({ name: "Collateral (SC)", value: 0 }),
		Map({ name: "Price per GB (SC)", value: 1, notes: "Current average price is 3 SC/GB" }),
		Map({ name: "Bandwidth Price (SC/byte)", value: 2 }),
	]),
	defaultsettings: List([
		Map({ name: "Max Duration (Weeks)", value: 30, min: 12 }),
		Map({ name: "Collateral (SC)", value: 0 }),
		Map({ name: "Price per GB (SC)", value: 1, notes: "Current average price is 3 SC/GB" }),
		Map({ name: "Bandwidth Price (SC/byte)", value: 2 }),
	]),
	files: List([
		Map({ path: "/Users/John/Desktop/Sia-UI.app/Contents/Resources/Sia/", size: 0 }),
		Map({ path: "/Users/John/Desktop/Sia-UI.app/Contents/Resources/Sia/", size: 0 }),
		Map({ path: "/Users/John/Desktop/Sia-UI.app/Contents/Resources/Sia/", size: 0 }),
		Map({ path: "/Users/John/Desktop/Sia-UI.app/Contents/Resources/Sia/", size: 0 }),
	]),
	earned: 200000,
	expected: 100000,
	acceptingContracts: 0,
})

export default function hostingReducer(state = initialState, action) {
	switch (action.type) {
	case constants.UPDATE_SETTING:
		let settingslist = state.get("usersettings")
		settingslist = settingslist.map((value, key) => (
			(value.get("name") === action.setting) ?
				value.set("value", action.value)
			: value
		)) 
		return state.set("usersettings", settingslist)

	case constants.TOGGLE_ACCEPTING:
		return state.set("acceptingContracts", !state.get("acceptingContracts"))

	case constants.UPDATE_SETTINGS_SUCCESS:
		return state.set("usersettings", action.settings.get("usersettings")).set("acceptingContracts", action.settings.get("acceptingContracts"))

	case constants.RESET_HOST:
		return state.set("usersettings", List([
			Map({ name: "Max Duration (Weeks)", value: 30, min: 12 }),
			Map({ name: "Collateral (SC)", value: 0 }),
			Map({ name: "Price per GB (SC)", value: 1, notes: "Current average price is 3 SC/GB" }),
			Map({ name: "Bandwidth Price (SC/byte)", value: 2 }),
		]))
	default:
		return state
	}
}
