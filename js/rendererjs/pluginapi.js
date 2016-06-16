// pluginapi.js: Sia-UI plugin API interface exposed to all plugins.
// This is injected into every plugin's global namespace.
const Siad = require('sia.js')
const Path = require('path')
const remote = require('electron').remote
const dialog = remote.dialog
const mainWindow = remote.getCurrentWindow()
const configLoader = remote.require(Path.join(__dirname, '../mainjs/config.js')).default
const config = configLoader(Path.join(__dirname, '../../config.json')).siad
Siad.configure(config)

window.SiaAPI = {
	call: Siad.call,
	config: config,
	hastingsToSiacoins: Siad.hastingsToSiacoins,
	siacoinsToHastings: Siad.siacoinsToHastings,
	openFile: (options) => dialog.showOpenDialog(mainWindow, options),
	saveFile: (options) => dialog.showSaveDialog(mainWindow, options),
	showMessage: (options) => dialog.showMessageBox(mainWindow, options),
	showError: (options) => dialog.showErrorBox(options.title, options.content),
}
