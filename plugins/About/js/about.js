'use strict';

// Library for communicating with Sia-UI
const IPCRenderer = require('electron').ipcRenderer;
// Siad wrapper
const Siad = require('sia.js');

// Make sure Siad settings are in sync with the rest of the UI's
var settings = IPCRenderer.sendSync('config', 'siad');
Siad.configure(settings);
// Keeps track of if the view is shown
var updating;
const refreshRate = 50000;

// DEVTOOL: uncomment to bring up devtools on plugin view
// IPCRenderer.sendToHost('devtools');

// Update version every 50 seconds that this plugin is open
function update() {
	Siad.call('/daemon/version', function(err, result) {
		if (err) {
			IPCRenderer.sendToHost('notification', '/daemon/version call failed!', 'error');
		} else {
			document.getElementById('siaversion').innerHTML = result;
		}
	});

	updating = setTimeout(update, refreshRate);
}

// Called upon showing
IPCRenderer.on('shown', update);
// Called upon transitioning away from this view
IPCRenderer.on('hidden', function() {
	clearTimeout(updating);
});
