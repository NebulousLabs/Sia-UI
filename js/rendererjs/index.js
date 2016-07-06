// Imported Electron modules
import Path from 'path'
import loadingScreen from './loadingScreen.js'
import Electron from 'electron'
import { scanFolder, loadPlugin, setCurrentPlugin, getPluginName } from './plugins.js'

const App = Electron.remote.app
const mainWindow = Electron.remote.getCurrentWindow()
const defaultPluginDirectory = Path.join(App.getAppPath(), './plugins')
const defaultHomePlugin = 'Files'

// Called at window.onload by the loading screen.
// Wait for siad to load, then load the plugin system.
function init(callback) {
	// Initialize plugins
	let plugins = scanFolder(defaultPluginDirectory)

	// The home plugin should be first in the sidebar, and about should be last.
	// We probably want a priority system for this instead.
	plugins = plugins.sort((p1) => {
		if (getPluginName(p1) === 'About') {
			return 1
		}
		return 0
	})

	plugins = plugins.sort((p1, p2) => {
		if (getPluginName(p2) === defaultHomePlugin) {
			return 1
		}
		return 0
	})

	let homePluginView
	// Load each plugin element into the UI
	for (let i = 0; i < plugins.size; i++) {
		const plugin = loadPlugin(plugins.get(i))
		if (getPluginName(plugins.get(i)) === defaultHomePlugin) {
			homePluginView = plugin
		}
	}
	const onHomeLoad = () => {
		setCurrentPlugin(defaultHomePlugin)
		homePluginView.removeEventListener('dom-ready', onHomeLoad)
		callback()
	}
	// wait for the home plugin to load before calling back
	homePluginView.addEventListener('dom-ready', onHomeLoad)
}

// If closeToTray is set, hide the window and cancel the close.
if (mainWindow.closeToTray) {
	window.onbeforeunload = function() {
		mainWindow.hide()
		return false
	}
}

// Once the main window loads, start the loading process.
window.onload = function() {
	loadingScreen(init)
}
