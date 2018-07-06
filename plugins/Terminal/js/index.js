// index.js: main entrypoint for the Sia-UI wallet plugin.
import React from 'react'
import ReactDOM from 'react-dom'
import CommandLine from './components/app.js'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './reducers/index.js'
import { initPlugin } from './utils/helpers.js'

// If dev enable window reload
if (process.env.NODE_ENV === 'development') {
  require('electron-css-reload')()
}

// Render the wallet plugin
const store = createStore(rootReducer)
const rootElement = (
  <Provider store={store}>
    <CommandLine />
  </Provider>
)

initPlugin()
ReactDOM.render(rootElement, document.getElementById('react-root'))
