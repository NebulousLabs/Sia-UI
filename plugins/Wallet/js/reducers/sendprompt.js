import { Map } from 'immutable';
import { START_SEND_PROMPT, SET_SEND_AMOUNT, SET_SEND_ADDRESS, CLOSE_SEND_PROMPT, SEND_SIACOIN } from '../constants/wallet.js';

const initialState = Map({
	visible: false,
	sendaddress: '',
	sendamount: '',
});
export default function sendpromptReducer(state = initialState, action) {
	switch (action.type) {
	case START_SEND_PROMPT:
		return state.set('visible', true);
	case SET_SEND_AMOUNT:
		return state.set('sendamount', action.amount);
	case SET_SEND_ADDRESS:
		return state.set('sendaddress', action.address);
	case CLOSE_SEND_PROMPT:
		return state.set('visible', false);
	default:
		return state;
	}
}
