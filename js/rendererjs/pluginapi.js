// pluginapi.js: Sia-UI plugin API interface exposed to all plugins.
// This is injected into every plugin's global namespace.
import Siad from 'sia.js'
import { remote } from 'electron'
import Path from 'path'
const dialog = remote.dialog
const app = remote.app
const mainWindow = remote.getCurrentWindow()
const config = remote.getGlobal('config')
Siad.configure(config.siad)
let disabled = false

// Poll Siad.ifRunning and disable the plugin if siad is not running.
setInterval(() => {
	Siad.ifRunning(() => {
		if (disabled) {
			window.location.reload()
		}
	}, () => {
		if (!disabled) {
			disabled = true
			document.body.innerHTML = "<h1>Siad has stopped.</h1>"
		}
	})
}, 2000)

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
