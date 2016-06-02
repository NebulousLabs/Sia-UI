// pluginapi.js: Sia-UI plugin API interface exposed to all plugins.
// This is injected into every plugin's global namespace.
import Siad from 'sia.js'
import { ipcRenderer, remote } from 'electron'
const { dialog } = remote
const mainWindow = remote.getCurrentWindow()

Siad.configure(ipcRenderer.sendSync('config', 'siad'))

export default SiaAPI = {
	call: Siad.apiCall,
	openFile: (options) => dialog.showOpenDialog(mainWindow, options),
	saveFile: (options) => dialog.showSaveDialog(mainWindow, options),
	message: (options) => dialog.showMessageBox(mainWindow, options),
	error: (options) => dialog.showErrorBox(options.title, options.content),
}
