import { Map } from 'immutable';

const initialState = Map({
	visible: false,
	password: '',
	seed: '',
});

export default function newwalletdialog(state = initialState, action) {
	switch (action.type) {
	default:
		return state;
	}
}
