import React from 'react'
import ReactDOM from 'react-dom'
import createSagaMiddleware from 'redux-saga'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './reducers/index.js'
import rootSaga from './sagas/index.js'
import App from './containers/app.js'
import { getAllowance, getContractCount, getWalletLockstate, getUploads, getFiles, getDownloads } from './actions/files.js'

const sagaMiddleware = createSagaMiddleware()
const store = createStore(
	rootReducer,
	applyMiddleware(sagaMiddleware)
)
sagaMiddleware.run(rootSaga)

const rootElement = (
	<Provider store={store}>
		<App />
	</Provider>
)
ReactDOM.render(rootElement, document.getElementById('react-root'))

store.dispatch(getWalletLockstate())
store.dispatch(getFiles())
store.dispatch(getUploads())
store.dispatch(getContractCount())
store.dispatch(getAllowance())

setInterval(() => {
	store.dispatch(getDownloads())
	store.dispatch(getUploads())
	store.dispatch(getWalletLockstate())
	store.dispatch(getFiles())
	store.dispatch(getContractCount())
	store.dispatch(getAllowance())
}, 3000)

