import Path from 'path'
import fs from 'fs'
import child_process from 'child_process'
import { Map } from 'immutable'
import http from 'http'
import url from 'url'
import * as constants from '../constants/helper.js'

export const checkSiaPath = () => new Promise((resolve, reject) => {
	fs.stat(Path.resolve(SiaAPI.config.attr('siac').path, './siac'), (err) => {
		 if (!err) {
			resolve()
		 } else {
			reject(err)
		 }
	})
})

export const initPlugin = () => checkSiaPath().catch(() => {
	// config.path doesn't exist. Prompt the user for siac's location
	if (!SiaAPI.config.attr('siac')) {
		SiaAPI.config.attr('siac', { path: '' })
	}
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

export const commandType = function(commandString, specialArray) {
	//Cleans string and sees if any subarray in array starts with the string when split.
	let args = commandString.replace(/\s*\s/g, ' ').trim().split(' ')
	if (args[0] === './siac' || args[0] === 'siac') {
		args.shift()
	}

	//Can't do a simple match because commands can be passed additional arguments.
	return specialArray.findIndex( (command) =>
		command.reduce((matches, argument, i) =>
			(matches && argument === args[i]),
		true) && commandString.indexOf('-h') === -1 //Also covers --help.
		//Don't show a password prompt if user is looking for help.
	)
}

export const spawnCommand = function(commandStr, actions, newid) {
	//Create new command object. Id doesn't need to be unique, just can't be the same for adjacent commands.

	//We set the command first so the user sees exactly what they type. (Minus leading and trailing spaces, double spaces, etc.)
	let commandString = commandStr.replace(/\s*\s/g, ' ').trim()
	let newCommand = Map({ command: commandString, result: '', id: newid, stat: 'running' })
	actions.addCommand(newCommand)

	//Remove surrounding whitespace and leading siac command.
	if (commandString.startsWith('siac')) {
		commandString = commandString.slice(4).trim()
	} else if (commandString.startsWith('./siac')) {
		commandString = commandString.slice(6).trim()
	}

	//Add address flag to siac.
	let args = commandString.split(' ')
	if (args.indexOf('-a') === -1 && args.indexOf('--address') === -1 && SiaAPI.config.attr('address')) {
		args = args.concat([ '-a', SiaAPI.config.attr('address') ])
	}

	let siac = child_process.spawn('./siac', args, { cwd: SiaAPI.config.attr('siac').path })

	//Update the UI when the process receives new ouput.
	let consumeChunk = function(chunk) {
		console.log('Data chunk ' + chunk)
		let chunkTrimmed = chunk.toString().replace(/stty: stdin isn't a terminal\n/g, '')
		actions.updateCommand(newCommand.get('command'), newCommand.get('id'), chunkTrimmed)
	}
	siac.stdout.on('data', consumeChunk)
	siac.stderr.on('data', consumeChunk)

	let closed = false
	let streamClosed = function() {
		if (!closed) {
			actions.endCommand(newCommand.get('command'), newCommand.get('id'))
			closed = true
		}
	}

	siac.on('error', () => {
		console.log('\tPROGRAM ERRORED')
		streamClosed()
	})
	siac.on('close', () => {
		console.log('\tPROGRAM CLOSED')
		streamClosed()
	})

	//If window is small auto close command overview so we can see the return value.
	if (document.getElementsByClassName('command-history-list')[0].offsetHeight < 180) {
		actions.hideCommandOverview()
	}

	return siac
}

export const httpCommand = function(commandStr, actions, newid) {
	let commandString = commandStr
	const originalCommand = commandStr.replace(/\s*\s/g, ' ').trim()

	//Remove surrounding whitespace and leading siac command.
	if (commandString.startsWith('siac')) {
		commandString = commandString.slice(4).trim()
	} else if (commandString.startsWith('./siac')) {
		commandString = commandString.slice(6).trim()
	}

	//Parse arguments.
	let args = commandString.split(' ')

	//Add address flag to siac.
	let siaAddr = url.parse('http://localhost:9980')

	if (args.indexOf('-a') === -1 && args.indexOf('--address') === -1) {
		if (SiaAPI.config.attr('address')) {
			//Load default address.
			siaAddr = url.parse('http://' + SiaAPI.config.attr('address'))
		}
	} else {
		//Parse address flag.
		let index = args.indexOf('-a')
		if  (index === -1) {
			index = args.indexOf('--address')

		}
		if (index < args.length-1) {
			siaAddr = url.parse('http://' + args[index+1])
		}
		args.splice(index, 2)
		commandString = args.join(' ')
	}

	let apiURL = ''
	switch (commandString) {
	case 'wallet unlock':
		apiURL = '/wallet/unlock'
		break

	case 'wallet load seed':
		apiURL = '/wallet/seed'
		break

	default:
		console.log(`ERROR Command is not an http command. Rerouting. ${commandString}`)
		return spawnCommand(commandString, actions).stdin
	}

	//Spawn new command if we are good to go.
	let newCommand = Map({ command: originalCommand, result: '', id: newid, stat: 'running' })
	actions.addCommand(newCommand)

	//Update the UI when the process receives new ouput.
	let consumeChunk = function(chunk) {
		console.log('Data chunk ' + chunk)
		let newChunk = chunk
		if (chunk.toString().trim() === '{"Success":true}') {
			newChunk = 'Success'
		}
		actions.updateCommand(newCommand.get('command'), newCommand.get('id'), newChunk)
	}

	let closed = false
	let streamClosed = function() {
		if (!closed) {
			actions.endCommand(newCommand.get('command'), newCommand.get('id'))
			closed = true
		}
	}

	//If window is small auto close command overview so we can see the return value.
	if (document.getElementsByClassName('command-history-list')[0].offsetHeight < 180) {
		actions.hideCommandOverview()
	}

	let options = {
		hostname: siaAddr.hostname,
		port: siaAddr.port,
		path: apiURL,
		method: 'POST',
		headers: {
			'User-Agent': 'Sia-Agent',
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	}
	let req = http.request(options, (res) => {
		res.on('data', consumeChunk)
		res.on('end', streamClosed)
	})
	req.on('error', (e) => {
		console.log(`problem with request: ${e.message}`)
		consumeChunk(e.message)
		streamClosed()
	})
	return req
}

export const commandInputHelper = function(e, actions, currentCommand, showCommandOverview, newid){
	//These commands need a password prompt.
	const specialCommands = [ ['wallet', 'load', 'seed'], ['wallet', 'unlock'], ['help'], ['?'] ]

	let eventTarget = e.target
	//Enter button.
	if (e.keyCode === 13) {

		//Check if command is special.
		switch ( commandType(currentCommand, specialCommands) ) {
		case constants.REGULAR_COMMAND: //Regular command.
			spawnCommand(currentCommand, actions, newid) //Spawn command defined in index.js.
			break

		case constants.WALLET_UNLOCK: //wallet unlock
		case constants.WALLET_SEED: //wallet load seed
			actions.showWalletPrompt()
			break

		case constants.HELP: //help
			let text = 'help'
		case constants.HELP_QMARK: //?
			let newText = text || '?'
			if (showCommandOverview) {
				actions.hideCommandOverview()
			} else {
				actions.showCommandOverview()
			}

			//The command log won't actually show a help command but we still want to be able to select it in the command history.
			let newCommand = Map({ command: newText, result: '', id: newid })
			actions.addCommand(newCommand)
			actions.endCommand(newCommand.get('command'), newCommand.get('id'))
			break

		default:
			console.log(`Command input error: ${currentCommand}`)
			break
		}
	 } else if (e.keyCode === 38) {
		//Up arrow.
		actions.loadPrevCommand(eventTarget.value)
		setTimeout( () => {
			eventTarget.setSelectionRange(eventTarget.value.length, eventTarget.value.length)
		}, 0)
	} else if (e.keyCode === 40) {
		//Down arrow.
		actions.loadNextCommand(eventTarget.value)
		setTimeout(() => {
			eventTarget.setSelectionRange(eventTarget.value.length, eventTarget.value.length)
		}, 0)
	}
}
