import { app } from 'electron'
import Path from 'path'
import loadConfig from './config.js'
import initWindow from './initWindow.js'

// load config.json manager
global.config = loadConfig(Path.join(app.getPath('userData'), 'config.json'))
let mainWindow

// Allow only one instance of Sia-UI
const shouldQuit = app.makeSingleInstance(() => {
	if (mainWindow) {
		if (mainWindow.isMinimized()) {
			mainWindow.restore()
		}
		mainWindow.focus()
	}
})

if (shouldQuit) {
	app.quit()
}

// When Electron loading has finished, start Sia-UI.
app.on('ready', () => {
	// Load mainWindow
	mainWindow = initWindow(config)
})

// Quit once all windows have been closed.
app.on('window-all-closed', () => {
	app.quit()
})

// On quit, save the config.
// There's no need to call siad.stop here, since if siad was launched by the UI,
// it will be a descendant of the UI in the process tree and will therefore be killed.
app.on('quit', () => {
	config.save()
})
