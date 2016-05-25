import { Map } from 'immutable';
import { SHOW_RECEIVE_PROMPT, HIDE_RECEIVE_PROMPT } from '../constants/wallet.js';

const initialState = Map({
	visible: false,
});
export default function receivePromptReducer(state = initialState, action) {
	switch (action.type) {
	case SHOW_RECEIVE_PROMPT:
		return state.set('visible', true);
	case HIDE_RECEIVE_PROMPT:
		return state.set('visible', false);
	default:
		return state;
	}
}