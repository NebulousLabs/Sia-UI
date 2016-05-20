import { Map, List } from 'immutable';
import { SET_ADDRESSES } from '../constants/addresslist.js';
const initialState = List();

export default function addresslist(state = initialState, action) {
	switch (action.type) {
	case SET_ADDRESSES:
		return List(action.addresses);
	}
}
