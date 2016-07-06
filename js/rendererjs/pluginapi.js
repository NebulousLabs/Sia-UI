// pluginapi.js: Sia-UI plugin API interface exposed to all plugins.
// This is injected into every plugin's global namespace.
import Siad from 'sia.js'
import { remote } from 'electron'
import React from 'react'
import DisabledPlugin from './disabledplugin.js'
const dialog = remote.dialog
const mainWindow = remote.getCurrentWindow()
const config = remote.getGlobal('config')
Siad.configure(config.siad)
let disabled = false

window.onload = () => {
	// ReactDOM needs a DOM in order to be imported,
	// but the DOM is not available until the plugin has loaded.
	// therefore, we have to global require it inside the window.onload event.

	/* eslint-disable global-require */
	const ReactDOM = require('react-dom')
	/* eslint-enable global-require */

	// Poll Siad.ifRunning and disable the plugin if siad is not running.
	setInterval(() => {
		Siad.ifRunning(() => {
			if (disabled) {
				disabled = false
				window.location.reload()
			}
		}, () => {
			if (!disabled) {
				disabled = true
				ReactDOM.render(<DisabledPlugin startSiad={Siad.start} />, document.body)
			}
		})
	}, 2000)
}

// Siad call wrapper.
// Only call siad if siad is running.
const callWrapper = (uri, callback) => {
	Siad.ifRunning(() => {
		Siad.call(uri, callback)
	})
}

window.SiaAPI = {
	call: callWrapper,
	config: config,
	hastingsToSiacoins: Siad.hastingsToSiacoins,
	siacoinsToHastings: Siad.siacoinsToHastings,
	openFile: (options) => dialog.showOpenDialog(mainWindow, options),
	saveFile: (options) => dialog.showSaveDialog(mainWindow, options),
	showMessage: (options) => dialog.showMessageBox(mainWindow, options),
	showError: (options) => dialog.showErrorBox(options.title, options.content),
}
