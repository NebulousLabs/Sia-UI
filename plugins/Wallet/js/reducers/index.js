import { combineReducers } from 'redux'
import wallet from './wallet.js'
import passwordprompt from './passwordprompt.js'
import newwalletdialog from './newwalletdialog.js'
import sendprompt from './sendprompt.js'
import receiveprompt from './receiveprompt.js'

const rootReducer = combineReducers({
	wallet,
	passwordprompt,
	newwalletdialog,
	sendprompt,
	receiveprompt,
})

export default rootReducer
