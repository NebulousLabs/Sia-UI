import Path from 'path'
import fs from 'fs'
import child_process from 'child_process'
import { Map } from 'immutable'
import http from 'http'
import url from 'url'
import * as constants from '../constants/helper.js'

export const checkSiaPath = () => new Promise((resolve, reject) => {
	fs.stat(SiaAPI.config.attr('siac').path, (err) => {
		 if (!err) {
			if (Path.basename(SiaAPI.config.attr('siac').path).indexOf('siac') !== -1){
                resolve()
            } else {
                reject({ message: "Invalid binary name." })
            }
		 } else {
			reject(err)
		 }
	})
})

export const initPlugin = () => checkSiaPath().catch(() => {
	//Look in the siad folder for siac.
	SiaAPI.config.attr('siac', { path: Path.resolve( Path.dirname(SiaAPI.config.attr('siad').path), (process.platform === 'win32' ? './siac.exe' : './siac') ) })
	checkSiaPath().catch(() => {
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
        if (siacPath) {
            if (Path.basename(siacPath[0]).indexOf('siac') === -1) {
                SiaAPI.showError({ title: 'Invalid Binary Name', content: 'The siac plugin must be called siac. Restart the plugin to choose a valid binary.' })
            } else {
        		SiaAPI.config.attr('siac', { path: siacPath[0] })
            }
        } else {
            SiaAPI.showError({ title: 'Siac not found', content: 'This plugin will be unusable until a proper siac binary is found.' })
        }
	})
	SiaAPI.config.save()
})

export const commandType = function(commandString, specialArray) {
	//Cleans string and sees if any subarray in array starts with the string when split.
	const args = commandString.replace(/\s*\s/g, ' ').trim().split(' ')
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
	const newCommand = Map({ command: commandString, result: '', id: newid, stat: 'running' })
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

	const siac = child_process.spawn('./siac', args, { cwd: Path.dirname(SiaAPI.config.attr('siac').path || '') })

	//Update the UI when the process receives new ouput.
	const consumeChunk = function(chunk) {
		const chunkTrimmed = chunk.toString().replace(/stty: stdin isn't a terminal\n/g, '')
		actions.updateCommand(newCommand.get('command'), newCommand.get('id'), chunkTrimmed)
	}
	siac.stdout.on('data', consumeChunk)
	siac.stderr.on('data', consumeChunk)

	let closed = false
	const streamClosed = function() {
		if (!closed) {
			actions.endCommand(newCommand.get('command'), newCommand.get('id'))
			closed = true
		}
	}

	siac.on('error', (e) => {
        consumeChunk(`Error running command: ${e.message}.\nIs your siac path correct?`)
		streamClosed()
	})
	siac.on('close', () => {
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
	const args = commandString.split(' ')

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
		return spawnCommand(commandString, actions).stdin
	}

	//Spawn new command if we are good to go.
	const newCommand = Map({ command: originalCommand, result: '', id: newid, stat: 'running' })
	actions.addCommand(newCommand)

	//Update the UI when the process receives new ouput.
	const consumeChunk = function(chunk) {
		let newChunk = chunk
		if (chunk.toString().trim() === '{"Success":true}') {
			newChunk = 'Success'
		}
		actions.updateCommand(newCommand.get('command'), newCommand.get('id'), newChunk)
	}

	let closed = false
	const streamClosed = function() {
		if (!closed) {
			actions.endCommand(newCommand.get('command'), newCommand.get('id'))
			closed = true
		}
	}

	//If window is small auto close command overview so we can see the return value.
	if (document.getElementsByClassName('command-history-list')[0].offsetHeight < 180) {
		actions.hideCommandOverview()
	}

	const options = {
		hostname: siaAddr.hostname,
		port: siaAddr.port,
		path: apiURL,
		method: 'POST',
		headers: {
			'User-Agent': 'Sia-Agent',
			'Content-Type': 'application/x-www-form-urlencoded',
		},
	}
	const req = http.request(options, (res) => {
		res.on('data', consumeChunk)
		res.on('end', streamClosed)
	})
	req.on('error', (e) => {
		consumeChunk(e.message)
		streamClosed()
	})
	return req
}

export const commandInputHelper = function(e, actions, currentCommand, showCommandOverview, newid) {
	//These commands need a password prompt or other special handling.
	const specialCommands = [ ['wallet', 'load', 'seed'], ['wallet', 'unlock'], ['help'], ['?'] ]

	const eventTarget = e.target
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
			const text = 'help'
		case constants.HELP_QMARK: //?
			const newText = text || '?'
			if (showCommandOverview) {
				actions.hideCommandOverview()
			} else {
				actions.showCommandOverview()
			}

			//The command log won't actually show a help command but we still want to be able to select it in the command history.
			const newCommand = Map({ command: newText, result: '', id: newid })
			actions.addCommand(newCommand)
			actions.endCommand(newCommand.get('command'), newCommand.get('id'))
			break

		default:
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

