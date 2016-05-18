import { combineReducers } from 'redux';
import wallet from './wallet.js';
import passwordprompt from './passwordprompt.js';

const rootReducer = combineReducers({
	wallet,
	passwordprompt,
});

export default rootReducer;
