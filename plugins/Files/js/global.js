'use strict';

/*
 * global.js:
 *   This file is the only js file sourced by the index.html. It defines what
 *   variables are in the DOM's global namespace, sets up button clickability,
 *   and other startup procedures for this plugin
 */

// Library for communicating with Sia-UI
const IPCRenderer = require('electron').ipcRenderer;
// Node modules
const Fs = require('fs');
const Path = require('path');
// Library for arbitrary precision in numbers
const BigNumber = require('bignumber.js');
// Ensure precision
BigNumber.config({ DECIMAL_PLACES: 24 });
BigNumber.config({ EXPONENTIAL_AT: 1e+9 });
// Siad wrapper/manager
const Siad = require('sia.js')
// Make sure Siad settings are in sync with the rest of the UI's
IPCRenderer.sendToHost('config', {key: 'siad'}, 'siadsettings');
IPCRenderer.on('siadsettings', function(settings) {
	Siad.configure({
		siad: settings,
	});
});
// Slight modification to Siad wrapper for standard error handling
Siad.apiCall = function(callObj, callback) {
	Siad.call(callObj, function(err, result) {
		if (err) {
			console.error(callObj, err);
			notify(err.toString(), 'error');
		} else {
			callback(result);
		}
	});
}

// Get filename from filepath
function nameFromPath(path) {
	return path.replace(/^.*[\\\/]/, '');
}

// Notification shortcut 
function notify(msg, type) {
	IPCRenderer.sendToHost('notify', msg, type);
}

// Ask UI to show tooltip bubble
function tooltip(message, element) {
	var rect = element.getBoundingClientRect();
	IPCRenderer.sendToHost('tooltip', message, {
		top: rect.top,
		bottom: rect.bottom,
		left: rect.left,
		right: rect.right,
		height: rect.height,
		width: rect.width,
		length: rect.length,
	});
}

// Broken way to simulate callback function style given ipc
// configCallback is set to the most recent callback to be executed upon
// results returned from ipc. Would not work with rapid config calls
var configCallback;
function config(key, value, callback) {
	if (callback === undefined) {
		callback = value;
		value = undefined;
	}
	IPCRenderer.sendToHost('config', {
		key: key,
		value: value,
	}, 'config');
	configCallback = callback;
}
IPCRenderer.on('config', configCallback);

// Confirm file deletion
$('#delete-file').click(function() {
	var nickname = $('#confirm-delete').find('.nickname').text();
	deleteFile(nickname);
	$('#confirm-delete').hide();
});
$('#cancel-delete').click(function() {
	$('#confirm-delete').hide();
});

