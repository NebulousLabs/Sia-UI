// index.js: main entrypoint for the Sia-UI wallet plugin.
import React from 'react'
import ReactDOM from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './js/reducers/index.js'
import CommandLine from './js/components/app.js'
import Path from 'path'
const fs = require('fs')
const child_process = require('child_process')
import { Map } from 'immutable'

const checkSiaPath = () => new Promise((resolve, reject) => {
    fs.stat(Path.resolve(SiaAPI.config.attr('siac').path, './siac'), (err) => {
         if (!err) {
              resolve()
         } else {
              reject(err)
         }
    })
})

checkSiaPath().catch(() => {
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


const spawnCommand = function (commandString, actions){
    //Create new command object. Id doesn't need to be unique, just can't be the same for adjacent commands.

    //We set the command first so the user sees exactly what they type. (Minus leading and trailing spaces.)
    commandString = commandString.trim()
    var newCommand = Map({ command: commandString, result: '', id: Math.floor(Math.random()*1000000) })

    //Remove surrounding whitespace and leading siac command.
    if (commandString.startsWith('siac')){
        commandString = commandString.slice(4).trim()
    }
    else if (commandString.startsWith('./siac')){
        commandString = commandString.slice(6).trim()
    }

    actions.addCommand(newCommand)

    var oldargs = commandString.split(' ')
    var args = oldargs;
    if (oldargs.indexOf("-a") !== -1 && oldargs.indexOf("--address") !== -1 && SiaAPI.config.attr("address")){
        args = [ '-a', SiaAPI.config.attr("address") ].concat(oldargs)
    }
    var siac = child_process.spawn('./siac', args, { cwd: SiaAPI.config.attr('siac').path })

    var consumeChunk = function (chunk){
        console.log('Data chunk ' + chunk)
        chunk = chunk.toString().replace(/stty: stdin isn't a terminal\n/g, "")
        actions.updateCommand(newCommand.get('command'), newCommand.get('id'), chunk)
    }

    //Update the UI when the process receives new ouput.
    siac.stdout.on('data', consumeChunk)
    siac.stderr.on('data', consumeChunk)

    var closed = false
    var streamClosed =  function (code){
        if (!closed){
            //actions.updateCommand(newCommand.get('command'), newCommand.get('id'), `\nReturn code: ${code}`)
            closed = true
        }
    }

    siac.on('error', function (code){ console.log(`\tPROGRAM ERRORED`); streamClosed(code) })
    siac.on('close', function (code){ console.log(`\tPROGRAM CLOSED`); streamClosed(code) })

    //If window is small auto close command overview so we can see the return value.
    if (document.getElementsByClassName("command-history-list")[0].offsetHeight < 100){
        actions.hideCommandOverview()
    }

    return siac
}




// Render the wallet plugin
const rootElement = (
     <Provider store={store}>
          <CommandLine />
     </Provider>
)

ReactDOM.render(rootElement, document.getElementById('react-root'))
