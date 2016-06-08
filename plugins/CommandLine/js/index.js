// index.js: main entrypoint for the Sia-UI wallet plugin.
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './js/reducers/index.js'
import CommandLine from './js/components/app.js'
import Path from 'path'

const checkSiaPath = () => new Promise((resolve, reject) => {
    fs.stat(SiaAPI.config.siac.path, (err) => {
         if (!err) {
              resolve()
         } else {
              reject(err)
         }
    })
})

checkSiaPath().catch(() => {
    // config.path doesn't exist.  Prompt the user for siad's location
    if (!SiaAPI.config.siac){ SiaAPI.config.siac = { path: "" } }
    SiaAPI.showError({ title: 'Siac not found', content: 'Sia-UI couldn\'t locate siac.  Please navigate to siac.' })
    const siacPath = SiaAPI.openFile({
        title: 'Please locate siac.',
        properties: ['openFile'],
        defaultPath: Path.join('..', SiaAPI.config.siac.path || "./" ),
        filters: [{ name: 'siac', extensions: ['*'] }],
    })
    SiaAPI.config.siac.path = Path.dirname(siacPath[0])
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
