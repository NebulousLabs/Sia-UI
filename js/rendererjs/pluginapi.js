// pluginapi.js: Sia-UI plugin API interface exposed to all plugins.
// This is injected into every plugin's global namespace.
import Siad from 'sia.js'
import { ipcRenderer, remote } from 'electron'
const { BrowserWindow, dialog } = remote
Siad.configure(ipcRenderer.sendSync('config', 'siad'))

export default SiaAPI = {
	call: Siad.apiCall,
	openFile: (options) => dialog.showOpenDialog(BrowserWindow, options),
	saveFile: (options) => dialog.showSaveDialog(BrowserWindow, options),
	message: (options) => dialog.showMessageBox(BrowserWindow, options),
	error: (options) => dialog.showErrorBox(options.title, options.content),
}
