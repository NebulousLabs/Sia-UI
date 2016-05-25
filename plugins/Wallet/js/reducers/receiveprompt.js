import { Map } from 'immutable';
import { SHOW_RECEIVE_PROMPT, HIDE_RECEIVE_PROMPT, SET_RECEIVE_ADDRESS } from '../constants/wallet.js';

const initialState = Map({
	visible: false,
	address: '',
});
export default function receivePromptReducer(state = initialState, action) {
	switch (action.type) {
	case SHOW_RECEIVE_PROMPT:
		return state.set('visible', true);
	case HIDE_RECEIVE_PROMPT:
		return state.set('visible', false);
	case SET_RECEIVE_ADDRESS:
		return state.set('address', action.address);
	default:
		return state;
	}
}