import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import FilesApp from './js/components/app.js'

const store = createStore(
	rootReducer,
)

const rootElement = (
	<Provider store={store}>
		<FilesApp />
	</Provider>
)

ReactDOM.render(rootElement, document.getElementById('react-root'))
