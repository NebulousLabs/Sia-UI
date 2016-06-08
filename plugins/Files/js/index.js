import React from 'react'
import ReactDOM from 'react-dom'
import createSagaMiddleware from 'redux-saga'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './js/reducers/index.js'
import rootSaga from './js/sagas/index.js'
import App from './js/containers/app.js'
import { getWalletLockstate, getMetrics, getFiles } from './js/actions/files.js'

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

store.dispatch(getWalletLockstate())
store.dispatch(getMetrics())
store.dispatch(getFiles('/'))
