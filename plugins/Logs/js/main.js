import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import loggingReducer from './reducer.js'
import App from './components/app.js'

export const logsPlugin = () => (
	<Provider store={createStore(loggingReducer)}>
		<App />
	</Provider>
)

