// index.js: main entrypoint for the Sia-UI wallet plugin.
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './js/reducers/index.js'
import CommandLine from './js/components/app.js'

const store = createStore(rootReducer)

// Render the wallet plugin
const rootElement = (
	<Provider store={store}>
		<CommandLine />
	</Provider>
)

ReactDOM.render(rootElement, document.getElementById('react-root'))
