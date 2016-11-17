import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import loggingReducer from './reducer.js'
import App from './components/app.js'
import * as actions from './actions.js'

export const logsPlugin = () => {
	const store = createStore(loggingReducer)
	setInterval(() => {
		store.dispatch(actions.reloadLog())
	}, 10000)
	return (
		<Provider store={store}>
			<App />
		</Provider>
	)
}

