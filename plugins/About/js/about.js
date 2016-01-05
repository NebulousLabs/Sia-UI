'use strict';

// Library for communicating with Sia-UI
const IPCRenderer = require('electron').ipcRenderer;
// Siad wrapper
const Siad = require('sia.js');

// Make sure Siad settings are in sync with the rest of the UI's
var settings = IPCRenderer.sendSync('config', 'siad');
Siad.configure(settings);

// Update version shown
Siad.call('/daemon/version', function(err, result) {
	if (err) {
		IPCRenderer.sendToHost('notification', '/daemon/version call failed!', 'error');
	} else {
		document.getElementById('siaversion').innerHTML = result.version;
	}
});
