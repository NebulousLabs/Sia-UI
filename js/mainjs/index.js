import { app, Tray } from 'electron'
import appTray from './trayMenu.js'
import Path from 'path'
import loadConfig from './config.js'
import initWindow from './initWindow.js'

// load config.json manager
global.config = loadConfig(Path.join(__dirname, '../config.json'))
let mainWindow
let appIcon

// When Electron loading has finished, start Sia-UI.
app.on('ready', () => {
	// Load mainWindow
	mainWindow = initWindow(config)
	mainWindow.toggleDevTools()
	appIcon = new Tray(Path.join(app.getAppPath(), 'assets', 'tray.png'))
	appIcon.setToolTip('Sia - The Collaborative Cloud.')
	appIcon.setContextMenu(appTray(mainWindow))
})

// Allow only one instance of Sia-UI
app.makeSingleInstance(() => {
	mainWindow.restore()
	mainWindow.focus()
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
