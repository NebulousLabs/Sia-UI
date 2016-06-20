// index.js: main entrypoint for the Sia-UI wallet plugin.
import React from 'react'
import ReactDOM from 'react-dom'
import CommandLine from './js/components/app.js'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './js/reducers/index.js'
import { initPlugin } from './js/utils/helpers.js'

// Render the wallet plugin
const store = createStore(rootReducer)
const rootElement = (
	<Provider store={store}>
		<CommandLine />
	</Provider>
)

initPlugin()
ReactDOM.render(rootElement, document.getElementById('react-root'))
