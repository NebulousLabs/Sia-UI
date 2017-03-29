// index.js: main entrypoint for the Sia-UI hosting plugin.
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { Provider } from 'react-redux'
import rootReducer from './reducers/index.js'
import initSaga from './sagas/saga.js'
import HostingApp from './components/app.js'
import * as actions from './actions/actions.js'


// Render the hosting plugin
const sagaMiddleware = createSagaMiddleware()
const store = createStore(rootReducer, applyMiddleware(sagaMiddleware))
const rootElement = (
	<Provider store={store}>
		<HostingApp />
	</Provider>
)

ReactDOM.render(rootElement, document.getElementById('react-root'))
sagaMiddleware.run(initSaga)

store.dispatch(actions.requestDefaultSettings())
store.dispatch(actions.fetchData())
store.dispatch(actions.getHostNSettingsCalls())
store.dispatch(actions.getHostConnectabilityStatus())

// Poll Siad for state changes.
setInterval(() => {
	store.dispatch(actions.fetchData())
}, 5000)

// slightly longer poll for checking host connectability
setInterval(() => {
	store.dispatch(actions.getHostConnectabilityStatus())
}, 6e4) // every 1 minute

// longer poll for checking host working status
setInterval(() => {
	store.dispatch(actions.getHostWorkingStatus())
}, 9e5) // every 15 minutes

