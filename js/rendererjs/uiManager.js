'use strict';

// Imported Electron modules
const Electron = require('electron');
const IPCRenderer = Electron.ipcRenderer;
const mainWindow = Electron.remote.getCurrentWindow();
// Imported Node modules
const Path = require('path');
const Fs = require('fs');
// Imported Other modules
const Siad = require('sia.js');
const $ = require('jquery');
// Notification System
const notification = require('./notificationManager.js');
// Loading Screen
const loadingScreen = require('./loadingScreen');

// Object to export
var ui = {};
// Variable to track error log
var errorLog;
// Shows tooltip with content on given element
var tooltipTimeout, tooltipVisible;

// Clicking the logo links to sia.tech
$('.logo-container').click(function() {
	Electron.shell.openExternal('http://sia.tech');
});

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
			errorLog = Fs.createWriteStream(Path.join(__dirname, '../..', 'errors.log'));
		}
		try {
			errorLog.write(message + '\n');
		} catch (e) {
			errorLog.write(e.toString() + '\n');
		}
	}
	notification(message, type, clickAction);
};

/**
 * Shows tooltip with content at given offset location
 * @function UIManager#tooltip
 * @param {string} content The message to display in tooltip
 * @param {Object} offset The dimensions of the element to display over
 * TODO: separate out tooltip management from this file
 */
ui.tooltip = function(content, offset) {
	var eTooltip = $('#tooltip');
	offset = offset || {
		top: 0,
		left: 0,
	};

	// Show the tooltip at the proper location
	eTooltip.show();
	eTooltip.html(content);
	var middleX = offset.left - (eTooltip.width()/2) + (offset.width/2);
	var topY = offset.top - (eTooltip.height()) - (offset.height/2);
	eTooltip.offset({
		top: topY,
		left: middleX,
	});

	// Fade the toolip from 0 to 1
	if (!tooltipVisible) {
		eTooltip.stop();
		eTooltip.css({'opacity':0});
		tooltipVisible = true;
		eTooltip.animate({
			'opacity':1
		}, 400);
	} else {
		eTooltip.stop();
		eTooltip.show();
		eTooltip.css({'opacity':1});
	}

	// Hide the tooltip after 1.4 seconds
	clearTimeout(tooltipTimeout);
	tooltipTimeout = setTimeout(function() {
		// eTooltip.hide();
		eTooltip.animate({
			'opacity':'0'
		}, 400, function() {
			tooltipVisible = false;
			eTooltip.hide();
		});
	}, 1400);
};

// Checks if there is an update available
function checkUpdate() {
	$.ajax({
		url: 'https://api.github.com/repos/NebulousLabs/Sia-UI/releases',
		type: 'GET',
		success: function(responseData, textStatus, jqXHR) {
			// If version matches latest release version, do nothing
			if (responseData[0].tag_name === require('../../package.json').version) {
				return;
			}

			// If not, provide links to UI release page
			var updatePage = function() {
				Electron.shell.openExternal('https://github.com/NebulousLabs/Sia-UI/releases');
			};
			$('#update-ui').show().click(updatePage);
			ui.notify('Update available for UI', 'update', updatePage);
		},
		error: function(jqXHR, textStatus, errorThrown) {
			// jqXHR is the XmlHttpRequest that jquery returns back on error
			var errCode = textStatus + ' ' + jqXHR.status + ' ' + errorThrown + ' ' + jqXHR.responseText;
			ui.notify('Update check failed: ' + errCode, 'error');
		},
	});
}

/**
* Called at window.onload, waits for siad to finish loading to show the UI
* @function UIManager#init
*/
function init() {
	// Initialize plugins
	ui.plugins = require('./pluginManager.js');
	checkUpdate();
}

/**
* Called at window.beforeunload, closes the errorLog
* @function UIManager#kill
*/
function closeLog() {
	// Close the error write stream
	if (errorLog) {
		errorLog.end();
	}
}

// Set up responses upon the window loading and closing
window.onload = function() {
	loadingScreen(init);
};
window.onbeforeunload = closeLog;

// Right-click brings up a context menu without blocking the UI
window.addEventListener('contextmenu', function (e) {
	e.preventDefault();
	IPCRenderer.send('context-menu');
}, false);

module.exports = ui;
