import React from 'react'
import ReactDOM from 'react-dom'
import createSagaMiddleware from 'redux-saga'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './reducers/index.js'
import rootSaga from './sagas/index.js'
import App from './containers/app.js'
import { fetchData } from './actions/files.js'

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

// update state when plugin is focused
window.onfocus = () => {
	store.dispatch(fetchData())
}

