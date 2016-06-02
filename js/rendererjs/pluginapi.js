// pluginapi.js: Sia-UI plugin API interface exposed to all plugins.
// This is injected into every plugin's global namespace.
const Siad = require('sia.js')
const ipcRenderer = require('electron').ipcRenderer
const remote = require('electron').remote
const dialog = remote.dialog
const mainWindow = remote.getCurrentWindow()
Siad.configure(ipcRenderer.sendSync('config', 'siad'))

window.SiaAPI = {
	call: Siad.call,
	hastingsToSiacoins: Siad.hastingsToSiacoins,
	siacoinsToHastings: Siad.siacoinsToHastings,
	openFile: (options) => dialog.showOpenDialog(mainWindow, options),
	saveFile: (options) => dialog.showSaveDialog(mainWindow, options),
	showMessage: (options) => dialog.showMessageBox(mainWindow, options),
	showError: (options) => dialog.showErrorBox(options.title, options.content),
}
