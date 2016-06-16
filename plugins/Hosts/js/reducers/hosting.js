import { Map, List } from 'immutable'
import * as constants from '../constants/constants.js'

const initialState = Map({
    numContracts: 0,
    storage: 0,
    usersettings: List([
        Map({ name: "Max Duration (Weeks)", value: 0, min: 12 }),
        Map({ name: "Collateral (SC)", value: 0 }),
        Map({ name: "Price per GB (SC)", value: 1, notes: "Current average price is 3 SC/GB" }),
        Map({ name: "Bandwidth Price (SC)", value: 2 }),
    ]),
})

export default function hostingReducer(state = initialState, action) {
	switch (action.type) {
	default:
		return state
	}
}
