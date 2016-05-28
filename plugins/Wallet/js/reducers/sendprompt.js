import { Map } from 'immutable'
import { SET_SEND_AMOUNT, SET_SEND_ADDRESS } from '../constants/wallet.js'

const initialState = Map({
	sendaddress: '',
	sendamount: '',
})
export default function sendPromptReducer(state = initialState, action) {
	switch (action.type) {
	case SET_SEND_AMOUNT:
		return state.set('sendamount', action.amount)
	case SET_SEND_ADDRESS:
		return state.set('sendaddress', action.address)
	default:
		return state
	}
}
