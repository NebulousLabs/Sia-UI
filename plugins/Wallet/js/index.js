// index.js: main entrypoint for the Sia-UI wallet plugin.
import React from 'react'
import ReactDOM from 'react-dom'
import createSagaMiddleware from 'redux-saga'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './reducers/index.js'
import rootSaga from './sagas/index.js'
import { getLockStatus, getBalance, getTransactions } from './actions/wallet.js'
import WalletApp from './components/app.js'

// Set up saga middleware system
const sagaMiddleware = createSagaMiddleware()
const store = createStore(
	rootReducer,
	applyMiddleware(sagaMiddleware)
)
sagaMiddleware.run(rootSaga)

// Render the wallet plugin
const rootElement = (
	<Provider store={store}>
		<WalletApp />
	</Provider>
)

ReactDOM.render(rootElement, document.getElementById('react-root'))

// Get initial UI state
store.dispatch(getLockStatus())
store.dispatch(getBalance())
store.dispatch(getTransactions())

// Poll Siad for state changes.
setInterval(() => {
	store.dispatch(getLockStatus())
	store.dispatch(getBalance())
	store.dispatch(getTransactions())
}, 15000)
