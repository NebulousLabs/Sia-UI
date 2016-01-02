'use strict';

/*
 * uiTools namespace module:
 *   uiTools holds various, useful functions that don't have a place elsewhere
 *   and shouldn't pollute the global namespace. These include communicating
 *   with the general UI, calculations, and formatting numbers
 */

// Node modules
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
const BigNumber = require('bignumber.js');

// Notification shortcut 
function notify(msg, type) {
	ipcRenderer.sendToHost('notification', msg, type);
}

// Tooltip shortcut
function tooltip(message, element) {
	var rect = element.getBoundingClientRect();
	ipcRenderer.sendToHost('tooltip', message, {
		top: rect.top,
		bottom: rect.bottom,
		left: rect.left,
		right: rect.right,
		height: rect.height,
		width: rect.width,
		length: rect.length,
	});
}

// Config shortcut
function config(key, value) {
	value = value || undefined;
	return ipcRenderer.sendSync('config', key);
}

// Dialog shortcut
function dialog(type, options) {
	return ipcRenderer.sendSync('dialog', type, options);
}

// Format to data size representation with 3 or less digits
function formatByte(bytes) {
	bytes = new BigNumber(bytes);
	if (bytes.isZero()) {
		return '0 B';
	}
	var k = 1000;
	var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	var i = Math.floor((Math.log(bytes) + 1) / Math.log(k));
	var number = new BigNumber(bytes).div(Math.pow(k, i)).round(2);
	return number + ' ' + units[i];
}

module.exports = {
	notify: notify,
	tooltip: tooltip,
	config: config,
	dialog: dialog,
	formatByte: formatByte,
};
