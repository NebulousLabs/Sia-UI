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
Siad.configure(IPCRenderer.sendSync('config', 'siad'));
// Slight modification to Siad wrapper for standard error handling
Siad.apiCall = function(callObj, callback) {
	Siad.call(callObj, function(err, result) {
		if (err) {
			console.error(callObj, err);
			notify(err.toString(), 'error');
		} else if (callback) {
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

// Confirm file deletion
$('#delete-file').click(function() {
	var nickname = $('#confirm-delete').find('.nickname').text();
	deleteFile(nickname);
	$('#confirm-delete').hide();
});
$('#cancel-delete').click(function() {
	$('#confirm-delete').hide();
});

