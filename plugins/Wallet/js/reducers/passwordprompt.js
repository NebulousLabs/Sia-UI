import { Map } from 'immutable';
import { HANDLE_PASSWORD_CHANGE } from '../constants/passwordprompt.js';

const initialState = Map({
	password: '',
});

export default function passwordpromptReducer(state = initialState, action) {
	switch (action.type) {
	case HANDLE_PASSWORD_CHANGE:
		return state.set('password', action.password);
	default:
		return state;
	}
}
