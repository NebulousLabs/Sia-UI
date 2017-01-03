import { combineReducers } from 'redux'
import wallet from './wallet.js'
import files from './files.js'
import deletedialog from './deletedialog.js'
import renamedialog from './renamedialog.js'
import allowancedialog from './allowancedialog.js'

const rootReducer = combineReducers({
	wallet,
	files,
	deletedialog,
	renamedialog,
	allowancedialog,
})

export default rootReducer
