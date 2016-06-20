// index.js: main entrypoint for the Sia-UI wallet plugin.
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { Provider } from 'react-redux'
import rootReducer from './reducers/index.js'
import initSaga from './sagas/saga.js'
import HostingApp from './components/app.js'


// Render the wallet plugin
const sagaMiddleware = createSagaMiddleware()
const store = createStore(rootReducer, applyMiddleware(sagaMiddleware))
const rootElement = (
	<Provider store={store}>
		<HostingApp />
	</Provider>
)

ReactDOM.render(rootElement, document.getElementById('react-root'))
sagaMiddleware.run(initSaga)

// Get initial UI state
//store.dispatch(getLockStatus())
//store.dispatch(getBalance())
//store.dispatch(getTransactions())

// Poll Siad for state changes.
//setInterval(() => {
	//store.dispatch(getLockStatus())
	//store.dispatch(getBalance())
	//store.dispatch(getTransactions())
//}, 15000)
