import { Map } from 'immutable'
import * as constants from '../constants/files.js'

const initialState = Map({
	locked: true,
})

export default function walletReducer(state = initialState, action) {
	switch (action.type) {
	case constants.SET_WALLET_LOCKSTATE:
		return state.set('locked', action.locked)
	}
}
