// Imported Electron modules
import Path from 'path'
import * as Siad from 'sia.js'
import loadingScreen from './loadingScreen.js'
import { remote } from 'electron'
import { scanFolder, loadPlugin, setCurrentPlugin, getPluginName } from './plugins.js'

const App = remote.app
const Tray = remote.Tray
const mainWindow = remote.getCurrentWindow()
const defaultPluginDirectory = Path.join(App.getAppPath(), './plugins')
const defaultHomePlugin = 'Files'
const config = remote.getGlobal('config')

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

// shutdown triggers a clean shutdown of siad.
const shutdown = async () => {
	const overlay = document.getElementsByClassName('overlay')[0]
	const overlayText = overlay.getElementsByClassName('centered')[0].getElementsByTagName('p')[0]
	const siadConfig = config.attr('siad')

	overlay.style.display = 'inline-flex'
	overlayText.textContent = 'Quitting Sia...'

	// Block, displaying Quitting Sia..., until Siad has stopped.
	if (typeof window.siadProcess !== 'undefined') {
		setTimeout(() => window.siadProcess.kill('SIGKILL'), 15000)
		const sleep = (ms = 0) => new Promise((r) => setTimeout(r, ms))
		while (await Siad.isRunning(siadConfig.address) === true) {
			await sleep(200)
		}
	}

	mainWindow.destroy()
}

// If closeToTray is set, hide the window and cancel the close.
// On windows, display a balloon notification on first hide
// to inform users that Sia-UI is still running.  NOTE: returning any value
// other than `undefined` cancels the close.
let hasClosed = false
window.onbeforeunload = async () => {
	if (mainWindow.closeToTray) {
		mainWindow.hide()
		if (process.platform === 'win32' && !hasClosed) {
			Tray.displayBalloon({
				title: 'Sia-UI information',
				content: 'Sia is still running.  Right click this tray icon to quit or restore Sia.',
			})
			hasClosed = true
		}
		return false
	}
	await shutdown()
	return undefined
}

// Once the main window loads, start the loading process.
window.onload = function() {
	loadingScreen(init)
}
