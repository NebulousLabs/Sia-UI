'use strict';

/*
 * global.js:
 *   This file is the only js file sourced by the index.html. It defines what
 *   variables are in the DOM's global namespace, sets up button clickability,
 *   and other startup procedures for this plugin
 */

// Node modules
const ipcRenderer = require('electron').ipcRenderer;
const fs = require('fs');
const path = require('path');
const BigNumber = require('bignumber.js');
const siad = require('sia.js')

// Notification shortcut 
function notify(msg, type) {
	ipcRenderer.sendToHost('notify', msg, type);
}

// Ensure precision
BigNumber.config({ DECIMAL_PLACES: 24 });
BigNumber.config({ EXPONENTIAL_AT: 1e+9 });
// Make sure siad settings are in sync with the rest of the UI's
siad.configure(ipcRenderer.sendSync('config', 'siad'));
// Slight modification to siad wrapper for standard error handling
siad.apiCall = function(callObj, callback) {
	siad.call(callObj, function(err, result) {
		if (err) {
			console.error(callObj, err);
			notify(err.toString(), 'error');
		} else if (callback) {
			callback(result);
		}
	});
}

// Ask UI to show tooltip bubble
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

// Confirm file deletion
$('#delete-file').click(function() {
	var nickname = $('#confirm-delete').find('.nickname').text();
	deleteFile(nickname);
	$('#confirm-delete').hide();
});
$('#cancel-delete').click(function() {
	$('#confirm-delete').hide();
});

