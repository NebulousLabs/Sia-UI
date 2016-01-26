'use strict';

// Library for communicating with Sia-UI
const electron = require('electron');
const ipcRenderer = require('electron').ipcRenderer;
// Siad wrapper
const Siad = require('sia.js');

// Make sure Siad settings are in sync with the rest of the UI's
var settings = ipcRenderer.sendSync('config', 'siad');
Siad.configure(settings);

// Set UI version via package.json.
document.getElementById('uiversion').innerHTML = require('process').env.npm_package_version;

// Set daemon version via API call.
Siad.call('/daemon/version', function(err, result) {
	if (err) {
		ipcRenderer.sendToHost('notification', err.toString(), 'error');
	} else {
		document.getElementById('siaversion').innerHTML = result.version;
	}
});

// Make FAQ button launch the FAQ webpage.
document.getElementById('faq').onclick = function() {
	electron.shell.openExternal('http://sia.tech/faq');
};
