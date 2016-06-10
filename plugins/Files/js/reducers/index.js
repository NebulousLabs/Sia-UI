import { combineReducers } from 'redux'
import wallet from './wallet.js'
import files from './files.js'
import allowancedialog from './allowancedialog.js'
import fileview from './fileview.js'

const rootReducer = combineReducers({
	wallet,
	files,
	allowancedialog,
	fileview,
})

export default rootReducer
