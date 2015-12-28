'use strict';

// Node modules
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;

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

module.exports = {
	notify: notify,
	tooltip: tooltip,
	config: config,
	dialog: dialog,
};
