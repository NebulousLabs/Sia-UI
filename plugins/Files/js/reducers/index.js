import { combineReducers } from 'redux'
import wallet from './wallet.js'
import files from './files.js'

const rootReducer = combineReducers({
	wallet,
	files,
})

export default rootReducer
