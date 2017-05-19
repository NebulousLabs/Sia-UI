import React from 'react'
import createSagaMiddleware from 'redux-saga'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './reducers/index.js'
import rootSaga from './sagas/index.js'
import { getLockStatus, getSyncState, getBalance, getTransactions } from './actions/wallet.js'
import WalletApp from './components/app.js'

export const initWallet = () => {
	// Set up saga middleware system
	const sagaMiddleware = createSagaMiddleware()
	const store = createStore(
		rootReducer,
		applyMiddleware(sagaMiddleware)
	)
	sagaMiddleware.run(rootSaga)

	// Get initial UI state
	const updateState = () => {
		store.dispatch(getLockStatus())
		store.dispatch(getSyncState())
		if (store.getState().wallet.get('unlocked')) {
			store.dispatch(getBalance())
			store.dispatch(getTransactions())
		}
	}

	// Poll Siad for state changes
	setInterval(updateState, 5000)
	updateState()

	// update state when plugin is opened
	window.onfocus = updateState

	return (
		<Provider store={store}>
			<WalletApp />
		</Provider>
	)
}

