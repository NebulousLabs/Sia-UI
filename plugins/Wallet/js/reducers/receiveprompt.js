import { Map } from 'immutable'
import { SET_RECEIVE_ADDRESS } from '../constants/wallet.js'

const initialState = Map({
	address: '',
})
export default function receivePromptReducer(state = initialState, action) {
	switch (action.type) {
	case SET_RECEIVE_ADDRESS:
		return state.set('address', action.address)
	default:
		return state
	}
}
