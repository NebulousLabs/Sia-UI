// index.js: main entrypoint for the Sia-UI wallet plugin.
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './js/reducers/index.js'
import CommandLine from './js/components/app.js'
import Path from 'path'
const fs = require('fs')

const checkSiaPath = () => new Promise((resolve, reject) => {
    fs.stat(Path.resolve(SiaAPI.config.attr('siac').path, './siac'), (err) => {
         if (!err) {
              resolve()
         } else {
              reject(err)
         }
    })
})

checkSiaPath().catch((err) => {
    // config.path doesn't exist.  Prompt the user for siad's location
    if (!SiaAPI.config.attr('siac')){ SiaAPI.config.attr('siac', { path: '' }) }
    SiaAPI.showError({ title: 'Siac not found', content: 'Sia-UI couldn\'t locate siac. Please navigate to siac.' })
    const siacPath = SiaAPI.openFile({
        title: 'Please locate siac.',
        properties: ['openFile'],
        defaultPath: Path.join('..', SiaAPI.config.attr('siac').path || './' ),
        filters: [{ name: 'siac', extensions: ['*'] }],
    })
    SiaAPI.config.attr('siac', { path: Path.dirname(siacPath[0]) })
    SiaAPI.config.save()
})

const store = createStore(rootReducer)

// Render the wallet plugin
const rootElement = (
     <Provider store={store}>
          <CommandLine />
     </Provider>
)

ReactDOM.render(rootElement, document.getElementById('react-root'))
