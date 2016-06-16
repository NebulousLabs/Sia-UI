// Imported Electron modules
import Path from 'path'
import Fs from 'fs'
import notification from './notificationManager.js'
import loadingScreen from './loadingScreen.js'

import { scanFolder, loadPlugin, setCurrentPlugin, getPluginName } from './plugins.js'
const defaultPluginDirectory = Path.join(__dirname, '../../plugins')
const defaultHomePlugin = 'Overview'

const packageinfo = require('../../package.json')
const Electron = require('electron')
const App = Electron.remote.app
const mainWindow = Electron.remote.getCurrentWindow()
const $ = require('jquery')

// Object to export
var ui = {}
// Variable to track error log
var errorLog
// Shows tooltip with content on given element
var tooltipTimeout, tooltipVisible

// Clicking the logo links to sia.tech
$('.logo-container').click(() => {
	Electron.shell.openExternal('http://sia.tech')
})

/**
 * Shows notification in lower right of UI window
 * @function UIManager#notify
 * @param {string} message What to display in notification
 * @param {string} type The form of notification
 * @param {function} clickAction The function to call upon the user
 * clicking the notification
 */
ui.notify = function(message, type, clickAction) {
	// Record errors for reference in `errors.log`
	if (type === 'error') {
		if (!errorLog) {
			errorLog = Fs.createWriteStream(Path.join(__dirname, '../..', 'errors.log'))
		}
		try {
			errorLog.write(message + '\n')
		} catch (e) {
			errorLog.write(e.toString() + '\n')
		}
	}
	notification(message, type, clickAction)
}

/**
 * Shows tooltip with content at given offset location
 * @function UIManager#tooltip
 * @param {string} content The message to display in tooltip
 * @param {Object} offset The dimensions of the element to display over
 * TODO: separate out tooltip management from this file
 */
ui.tooltip = function(content, requestedOffset) {
	var eTooltip = $('#tooltip')
	offset = requestedOffset || {
		top: 0,
		left: 0,
	}

	// Show the tooltip at the proper location
	eTooltip.show()
	eTooltip.html(content)
	var middleX = offset.left - (eTooltip.width()/2) + (offset.width/2)
	var topY = offset.top - (eTooltip.height()) - (offset.height/2)
	eTooltip.offset({
		top: topY,
		left: middleX,
	})

	// Fade the toolip from 0 to 1
	if (!tooltipVisible) {
		eTooltip.stop()
		eTooltip.css({'opacity':0})
		tooltipVisible = true
		eTooltip.animate({
			'opacity':1,
		}, 400)
	} else {
		eTooltip.stop()
		eTooltip.show()
		eTooltip.css({'opacity':1})
	}

	// Hide the tooltip after 1.4 seconds
	clearTimeout(tooltipTimeout)
	tooltipTimeout = setTimeout(() => {
		// eTooltip.hide();
		eTooltip.animate({
			'opacity':'0',
		}, 400, () => {
			tooltipVisible = false
			eTooltip.hide()
		})
	}, 1400)
}

// Checks if there is an update available
function checkUpdate() {
	$.ajax({
		url: 'https://api.github.com/repos/NebulousLabs/Sia-UI/releases',
		type: 'GET',
		success: function(responseData) {
			// If version matches latest release version, do nothing
			if (responseData[0].tag_name === packageinfo.version) {
				return
			}

			// If not, provide links to UI release page
			var updatePage = function() {
				Electron.shell.openExternal('https://github.com/NebulousLabs/Sia-UI/releases')
			}
			$('#update-ui').show().click(updatePage)
			ui.notify('Update available for UI', 'update', updatePage)
		},
		error: function(jqXHR, textStatus, errorThrown) {
			// jqXHR is the XmlHttpRequest that jquery returns back on error
			var errCode = textStatus + ' ' + jqXHR.status + ' ' + errorThrown + ' ' + jqXHR.responseText
			ui.notify('Update check failed: ' + errCode, 'error')
		},
	})
}

/**
* Called at window.onload.
* Waits for siad to load, then loads the plugin system.
* @function UIManager#init
*/
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
	// wait for the home plugin to load before calling back
	homePluginView.addEventListener('dom-ready', () => {
		setCurrentPlugin(defaultHomePlugin)
		checkUpdate()
		callback()
	})
}

/**
* Called at app.will-quit, closes the errorLog
* @function UIManager#kill
*/
function closeLog() {
	// Close the error write stream
	if (errorLog) {
		errorLog.end()
	}
}
App.on('will-quit', closeLog)

// If closeToTray is set, hide the window and cancel the close.
if (mainWindow.closeToTray) {
	window.onbeforeunload = function() {
		mainWindow.hide()
		return false
	}
}

// Set up responses upon the window loading and closing
window.onload = function() {
	loadingScreen(init)
}

module.exports = ui
