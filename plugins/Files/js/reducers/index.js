import { combineReducers } from 'redux'
import wallet from './wallet.js'
import files from './files.js'
import allowancedialog from './allowancedialog.js'
import fileview from './fileview.js'
import downloadlist from './downloadlist.js'

const rootReducer = combineReducers({
	wallet,
	files,
	allowancedialog,
	fileview,
	downloadlist,
})

export default rootReducer
