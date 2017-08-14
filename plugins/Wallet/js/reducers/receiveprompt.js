import { Map } from 'immutable'
import { SET_RECEIVE_ADDRESS, SET_RECEIVE_ADDRESSES, SET_ADDRESS_DESCRIPTION } from '../constants/wallet.js'

const initialState = Map({
	address: '',
	description: '',
	addresses: [],
})
export default function receivePromptReducer(state = initialState, action) {
	switch (action.type) {
	case SET_RECEIVE_ADDRESSES:
		return state.set('addresses', action.addresses)
	case SET_ADDRESS_DESCRIPTION:
		return state.set('description', action.description)
	case SET_RECEIVE_ADDRESS:
		return state.set('address', action.address)
	default:
		return state
	}
}
