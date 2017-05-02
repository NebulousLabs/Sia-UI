// loadingScreen.js: display a loading screen until communication with Siad has been established.
// if an available daemon is not running on the host,
// launch an instance of siad using config.js.
import { remote, shell } from 'electron'
import * as Siad from 'sia.js'
import Path from 'path'
import React from 'react'
import ReactDOM from 'react-dom'
import StatusBar from './statusbar.js'

const dialog = remote.dialog
const app = remote.app
const fs = remote.require('fs')
const config = remote.getGlobal('config')
const siadConfig = config.attr('siad')

const spinner = document.getElementById('loading-spinner')
const overlay = document.getElementsByClassName('overlay')[0]
const overlayText = overlay.getElementsByClassName('centered')[0].getElementsByTagName('p')[0]
const errorLog = document.getElementById('errorlog')
overlayText.textContent = 'Loading Sia...'

const showError = (error) => {
	overlayText.style.display = 'none'
	errorLog.textContent = 'A critical error loading Sia has occured: ' + error
	errorLog.style.display = 'inline-block'
	spinner.style.display = 'none'
}

// startUI starts a Sia UI instance using the given welcome message.
// calls initUI() after displaying a welcome message.
const startUI = (welcomeMsg, initUI) => {
	// Display a welcome message, then initialize the ui
	overlayText.innerHTML = welcomeMsg

	// Construct the status bar component and poll for updates from Siad
	const updateSyncStatus = async function() {
		try {
			const consensusData = await Siad.call(siadConfig.address, {timeout: 500, url: '/consensus'})
			const gatewayData = await Siad.call(siadConfig.address, {timeout: 500, url: '/gateway'})
			ReactDOM.render(<StatusBar peers={gatewayData.peers.length} synced={consensusData.synced} blockheight={consensusData.height} />, document.getElementById('statusbar'))
			await new Promise((resolve) => setTimeout(resolve, 5000))
		} catch (e) {
			await new Promise((resolve) => setTimeout(resolve, 500))
			console.error('error updating sync status: ' + e.toString())
		}
		updateSyncStatus()
	}

	updateSyncStatus()

	initUI(() => {
		overlay.style.display = 'none'
	})
}

// checkSiaPath validates config's Sia path.  returns a promise that is
// resolved with `true` if siadConfig.path exists or `false` if it does not
// exist.
const checkSiaPath = () => new Promise((resolve) => {
	fs.stat(siadConfig.path, (err) => {
		if (!err) {
			resolve(true)
		} else {
			resolve(false)
		}
	})
})

// unexpectedExitHandler handles an unexpected siad exit, displaying the error
// piped to siad-output.log.
const unexpectedExitHandler = () => {
	try {
		const errorMsg = fs.readFileSync(Path.join(siadConfig.datadir, 'siad-output.log'))
		showError('Siad unexpectedly exited. Error log: ' + errorMsg)
	} catch (e) {
		showError('Siad unexpectedly exited.')
	}
}

// Check if Siad is already running on this host.
// If it is, start the UI and display a welcome message to the user.
// Otherwise, start a new instance of Siad using config.js.
export default async function loadingScreen(initUI) {
	// Create the Sia data directory if it does not exist
	try {
		fs.statSync(siadConfig.datadir)
	} catch (e) {
		fs.mkdirSync(siadConfig.datadir)
	}
	// If Sia is already running, start the UI with a 'Welcome Back' message.
	const running = await Siad.isRunning(siadConfig.address)
	if (running) {
		startUI('Welcome back', initUI)
		return
	}

	// check siadConfig.path, if it doesn't exist optimistically set it to the
	// default path
	if (!await checkSiaPath(siadConfig.path)) {
		siadConfig.path = config.defaultSiadPath
	}

	// check siadConfig.path, and ask for a new path if siad doesn't exist.
	if (!await checkSiaPath(siadConfig.path)) {
		// config.path doesn't exist.  Prompt the user for siad's location
		dialog.showErrorBox('Siad not found', 'Sia-UI couldn\'t locate siad.  Please navigate to siad.')
		const siadPath = dialog.showOpenDialog({
			title: 'Please locate siad.',
			properties: ['openFile'],
			defaultPath: Path.join('..', siadConfig.path),
			filters: [{ name: 'siad', extensions: ['*'] }],
		})
		if (typeof siadPath === 'undefined') {
			// The user didn't choose siad, we should just close.
			app.quit()
		}
		siadConfig.path = siadPath[0]
	}

	// Launch the new Siad process
	try {
		const siadProcess = Siad.launch(siadConfig.path, {
			'sia-directory': siadConfig.datadir,
			'rpc-addr': siadConfig.rpcaddr,
			'host-addr': siadConfig.hostaddr,
			'api-addr': siadConfig.address,
			'modules': 'cghrtw',
		})
		siadProcess.on('error', (e) => showError('Siad couldnt start: ' + e.toString()))
		siadProcess.on('close', unexpectedExitHandler)
		siadProcess.on('exit', unexpectedExitHandler)
		window.siadProcess = siadProcess
	} catch (e) {
		showError(e.toString())
		return
	}

	// Set a timeout to display a warning message about long load times caused by rescan.
	setTimeout(() => {
		if (overlayText.textContent === 'Loading Sia...') {
			overlayText.innerHTML= 'Loading can take a while after upgrading to a new version. Check the <a style="text-decoration: underline; cursor: pointer" id="releasenotelink">release notes</a> for more details.'

			document.getElementById('releasenotelink').onclick = () => {
				shell.openExternal('https://github.com/NebulousLabs/Sia/releases')
			}
		}
	}, 30000)

	// Wait for this process to become reachable before starting the UI.
	const sleep = (ms = 0) => new Promise((r) => setTimeout(r, ms))
	while (await Siad.isRunning(siadConfig.address) === false) {
		await sleep(500)
	}
	// Unregister callbacks
	window.siadProcess.removeAllListeners('error')
	window.siadProcess.removeAllListeners('exit')
	window.siadProcess.removeAllListeners('close')

	startUI('Welcome to Sia', initUI)
}
