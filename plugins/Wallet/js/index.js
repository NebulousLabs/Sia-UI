// index.js: main entrypoint for the Sia-UI wallet plugin.

'use strict'

import React from 'react';
import ReactDOM from 'react-dom';
import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './js/reducers/index.js';
import * as sagas from './js/sagas/wallet.js'
import { getLockStatus, getBalance, getAddresses } from './js/actions/wallet.js';
import WalletApp from './js/components/app.js';

// Set up saga middleware system
const sagaMiddleware = createSagaMiddleware();
const store = createStore(
	rootReducer,
	applyMiddleware(sagaMiddleware)
);
sagaMiddleware.run(sagas.watchGetLockStatus);
sagaMiddleware.run(sagas.watchUnlockWallet);
sagaMiddleware.run(sagas.watchCreateNewWallet);
sagaMiddleware.run(sagas.watchGetBalance);
sagaMiddleware.run(sagas.watchGetAddresses);

// Render the wallet plugin
const rootElement = (
	<Provider store={store}>
		<WalletApp />
	</Provider>
);

ReactDOM.render(rootElement, document.getElementById('react-root'));

// Dispatch getLockStatus and getBalance to set the initial state of the wallet plugin
store.dispatch(getLockStatus());
store.dispatch(getBalance());
store.dispatch(getAddresses());

// Update balance every second.
setInterval(() => {
	store.dispatch(getBalance())
}, 1000);
