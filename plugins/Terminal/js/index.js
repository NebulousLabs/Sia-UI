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
const http = require('http')
const url = require('url')

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
    // config.path doesn't exist.    Prompt the user for siad's location
    if (!SiaAPI.config.attr('siac')){ SiaAPI.config.attr('siac', { path: '' }) }
    SiaAPI.showError({ title: 'Siac not found', content: 'Sia-UI couldn\'t locate siac. Please navigate to siac.' })
    const siacPath = SiaAPI.openFile({
        title: 'Please locate siac.',
        properties: ['openFile'],
        defaultPath: Path.join('..', SiaAPI.config.attr('siac').path || './' ),
        filters: [{ name: 'siac', extensions: ['*'] }]
    })
    SiaAPI.config.attr('siac', { path: Path.dirname(siacPath[0]) })
    SiaAPI.config.save()
})

const store = createStore(rootReducer)

const isCommandSpecial = function (commandString, specialArray){
    //Cleans string and sees if any subarray in array starts with the string when split.
    var args = commandString.replace(/\s*\s/g, ' ').trim().split(' ')
    if (args[0] == './siac' || args[0] == 'siac'){ args.shift() }

    //Can't do a simple match because commands can be passed additional arguments.
    return specialArray.findIndex( (command) => 
        command.reduce((matches, argument, i) =>
            (matches && argument === args[i]),
        true) && commandString.indexOf('-h') == -1 //Also covers --help.
        //Don't show a password prompt if user is looking for help.
    )
}

const spawnCommand = function (commandString, actions){
    //Create new command object. Id doesn't need to be unique, just can't be the same for adjacent commands.

    //We set the command first so the user sees exactly what they type. (Minus leading and trailing spaces, double spaces, etc.)
    commandString = commandString.replace(/\s*\s/g, ' ').trim()
    var newCommand = Map({ command: commandString, result: '', id: Math.floor(Math.random()*1000000), stat: 'running' })
    actions.addCommand(newCommand)

    //Remove surrounding whitespace and leading siac command.
    if (commandString.startsWith('siac')){
        commandString = commandString.slice(4).trim()
    }
    else if (commandString.startsWith('./siac')){
        commandString = commandString.slice(6).trim()
    }

    //Add address flag to siac.
    var args = commandString.split(' ')
    if (args.indexOf('-a') === -1 && args.indexOf('--address') === -1 && SiaAPI.config.attr('address')){
        args = args.concat([ '-a', SiaAPI.config.attr('address') ])
    }

    var siac = child_process.spawn('./siac', args, { cwd: SiaAPI.config.attr('siac').path })

    //Update the UI when the process receives new ouput.
    var consumeChunk = function (chunk){
        console.log('Data chunk ' + chunk)
        chunk = chunk.toString().replace(/stty: stdin isn't a terminal\n/g, '')
        actions.updateCommand(newCommand.get('command'), newCommand.get('id'), chunk)
    }
    siac.stdout.on('data', consumeChunk)
    siac.stderr.on('data', consumeChunk)

    var closed = false
    var streamClosed = function (code){
        if (!closed){
            actions.updateCommand(newCommand.get('command'), newCommand.get('id'), undefined, 'done')
            closed = true
        }
    }

    siac.on('error', function (code){ console.log(`\tPROGRAM ERRORED`); streamClosed(code) })
    siac.on('close', function (code){ console.log(`\tPROGRAM CLOSED`); streamClosed(code) })


    //If window is small auto close command overview so we can see the return value.
    if (document.getElementsByClassName('command-history-list')[0].offsetHeight < 180){
        actions.hideCommandOverview()
    }

    return siac
}


const httpCommand = function(commandString, actions){
    const originalCommand = commandString.replace(/\s*\s/g, ' ').trim()

    //Remove surrounding whitespace and leading siac command.
    if (commandString.startsWith('siac')){ commandString = commandString.slice(4).trim() }
    else if (commandString.startsWith('./siac')){ commandString = commandString.slice(6).trim() }

    //Parse arguments.
    var args = commandString.split(' ')

    //Add address flag to siac.
    var siaAddr = url.parse('http://localhost:9980'); 

    if (args.indexOf('-a') === -1 && args.indexOf('--address') === -1){
        if (SiaAPI.config.attr('address')){
            //Load default address.
            siaAddr = url.parse('http://' + SiaAPI.config.attr('address'))
        }
    }

    else {
        //Parse address flag.
        var index = args.indexOf('-a')
        if  (index == -1){ index = args.indexOf('--address') }
        if (index < args.length-1){
            siaAddr = url.parse('http://' + args[index+1])
        }
        args.splice(index, 2)
        commandString = args.join(' ')
    }

    var apiURL = ''
    switch (commandString){
        case 'wallet unlock':
            apiURL = '/wallet/unlock'
            break;

        case 'wallet load seed':
            apiURL = '/wallet/seed'
            break;

        default:
            console.log(`ERROR Command is not an http command. Rerouting. ${commandString}`)
            return spawnCommand(commandString, actions).stdin
    }

    //Spawn new command if we are good to go.
    var newCommand = Map({ command: originalCommand, result: '', id: Math.floor(Math.random()*1000000), stat: 'running' })
    actions.addCommand(newCommand)

    //Update the UI when the process receives new ouput.
    var consumeChunk = function (chunk){
        console.log('Data chunk ' + chunk)
        if (chunk.toString().trim() === '{"Success":true}'){ chunk = 'Success' }
        actions.updateCommand(newCommand.get('command'), newCommand.get('id'), chunk)
    }

    var closed = false
    var streamClosed = function (code){
        if (!closed){
            actions.updateCommand(newCommand.get('command'), newCommand.get('id'), undefined, 'done')
            closed = true
        }
    }

    //If window is small auto close command overview so we can see the return value.
    if (document.getElementsByClassName('command-history-list')[0].offsetHeight < 180){
        actions.hideCommandOverview()
    }

    var options = {
        hostname: siaAddr.hostname,
        port: siaAddr.port,
        path: apiURL,
        method: 'POST',
        headers: {
            'User-Agent': 'Sia-Agent',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    var req = http.request(options, (res) => {
        res.on('data', consumeChunk);
        res.on('end', streamClosed)
    });    
    req.on('error', (e) => { console.log(`problem with request: ${e.message}`); consumeChunk(e.message); streamClosed() });
    return req 
}



// Render the wallet plugin
const rootElement = (
     <Provider store={store}>
            <CommandLine />
     </Provider>
)

ReactDOM.render(rootElement, document.getElementById('react-root'))
