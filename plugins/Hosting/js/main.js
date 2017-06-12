import React from 'react'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { Provider } from 'react-redux'
import rootReducer from './reducers/index.js'
import rootSaga from './sagas/saga.js'
import HostingApp from './components/app.js'
import * as actions from './actions/actions.js'

export const hostingPlugin = () => {
	const sagaMiddleware = createSagaMiddleware()
	const store = createStore(rootReducer, applyMiddleware(sagaMiddleware))
	sagaMiddleware.run(rootSaga)

	store.dispatch(actions.requestDefaultSettings())
	store.dispatch(actions.fetchData())

	const updateState = () => {
		store.dispatch(actions.fetchData())
		store.dispatch(actions.getHostStatus())
	}

	// Poll Siad for state changes.
	setInterval(updateState, 20000)

	// update state immediately when this plugin is focused
	window.onfocus = updateState

	return (
		<Provider store={store}>
			<HostingApp />
		</Provider>
	)
}

