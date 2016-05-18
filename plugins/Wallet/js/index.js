// index.js: main entrypoint for the Sia-UI wallet plugin.

'use strict'

import React from 'react';
import ReactDOM from 'react-dom';
import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './js/reducers/index.js';
import { watchGetLockStatus } from './js/sagas/locking.js'
import { getLockStatus } from './js/actions/locking.js';
import LockScreen from './js/containers/lockscreen.js';
import PasswordPrompt from './js/containers/passwordprompt.js';

// Set up saga middleware system
const sagaMiddleware = createSagaMiddleware();
const store = createStore(
	rootReducer,
	applyMiddleware(sagaMiddleware)
);
sagaMiddleware.run(watchGetLockStatus)

// Render the wallet plugin

const rootElement = (
	<Provider store={store}>
		<LockScreen />
		<PasswordPrompt />
	</Provider>
);

ReactDOM.render(rootElement, document.getElementById('react-root'));

store.dispatch(getLockStatus());
