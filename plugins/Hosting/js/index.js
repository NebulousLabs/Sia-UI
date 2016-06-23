// index.js: main entrypoint for the Sia-UI wallet plugin.
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { Provider } from 'react-redux'
import rootReducer from './reducers/index.js'
import initSaga from './sagas/saga.js'
import HostingApp from './components/app.js'
import * as actions from './actions/actions.js'


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

// Poll Siad for state changes.
setInterval(() => {
	store.dispatch(actions.fetchData({ ignoreSettings: true }))
}, 5000)
