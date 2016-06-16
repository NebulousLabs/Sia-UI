// index.js: main entrypoint for the Sia-UI wallet plugin.
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './js/reducers/index.js'
import HostingApp from './js/components/app.js'

// Render the wallet plugin
const store = createStore(rootReducer)
const rootElement = (
	<Provider store={store}>
		<HostingApp />
	</Provider>
)

ReactDOM.render(rootElement, document.getElementById('react-root'))

// Get initial UI state
//store.dispatch(getLockStatus())
//store.dispatch(getBalance())
//store.dispatch(getTransactions())

// Poll Siad for state changes.
setInterval(() => {
	//store.dispatch(getLockStatus())
	//store.dispatch(getBalance())
	//store.dispatch(getTransactions())
}, 15000)
