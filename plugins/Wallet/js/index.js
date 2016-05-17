// index.js: main entrypoint for the Sia-UI wallet plugin.

'use strict'

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './js/reducers/index.js';
import LockScreen from './js/containers/lockscreen.js';

const store = createStore(
	rootReducer
);

const rootElement = (
	<Provider store={store}>
		<LockScreen />
	</Provider>
);
console.log(rootElement);
ReactDOM.render(rootElement, document.getElementById('react-root'));
