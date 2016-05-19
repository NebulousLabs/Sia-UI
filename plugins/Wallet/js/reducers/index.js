import { combineReducers } from 'redux';
import wallet from './wallet.js';
import passwordprompt from './passwordprompt.js';
import newwalletdialog from './newwalletdialog.js';

const rootReducer = combineReducers({
	wallet,
	passwordprompt,
	newwalletdialog,
});

export default rootReducer;
