import { combineReducers } from 'redux'
import wallet from './wallet.js'
import files from './files.js'
import allowancedialog from './allowancedialog.js'

const rootReducer = combineReducers({
	wallet,
	files,
	allowancedialog,
})

export default rootReducer
