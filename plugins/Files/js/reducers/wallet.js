import { Map } from 'immutable'
import * as constants from '../constants/files.js'

const initialState = Map({
	unlocked: false,
})

export default function walletReducer(state = initialState, action) {
	switch (action.type) {
	case constants.SET_WALLET_LOCKSTATE:
		return state.set('unlocked', action.unlocked)
	}
}
