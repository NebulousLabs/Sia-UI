import { combineReducers } from 'redux'
import wallet from './wallet.js'
import files from './files.js'
import allowancedialog from './allowancedialog.js'
import deletedialog from './deletedialog.js'

const rootReducer = combineReducers({
	wallet,
	files,
	allowancedialog,
	deletedialog,
})

export default rootReducer
