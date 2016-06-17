import { Map, List } from 'immutable'
import * as constants from '../constants/constants.js'

const initialState = Map({
	numContracts: 0,
	storage: 0,
	usersettings: List([
		Map({ name: "Max Duration (Weeks)", value: 0, min: 12 }),
		Map({ name: "Collateral (SC)", value: 0 }),
		Map({ name: "Price per GB (SC)", value: 0, notes: "Current average price is 3 SC/GB" }),
		Map({ name: "Bandwidth Price (SC/byte)", value: 0 }),
	]),
	defaultsettings: List([
		Map({ name: "Max Duration (Weeks)", value: 30, min: 12 }),
		Map({ name: "Collateral (SC)", value: 0 }),
		Map({ name: "Price per GB (SC)", value: 1, notes: "Current average price is 3 SC/GB" }),
		Map({ name: "Bandwidth Price (SC/byte)", value: 2 }),
	]),
	files: List([
	]),
	earned: 0,
	expected: 0,
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

	case constants.FETCH_DATA_SUCCESS:
		return state.set("usersettings", action.data.get("usersettings"))
			.set("acceptingContracts", action.data.get("acceptingContracts"))
			.set("numContracts", action.data.get("numContracts"))
			.set("storage", action.data.get("storage"))
			.set("earned", action.data.get("earned"))
			.set("expected", action.data.get("expected"))
			.set("files", action.data.get("files"))

	default:
		return state
	}
}
