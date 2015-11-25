'use strict';

// Library for communicating with Sia-UI
const IPCRenderer = require('electron').ipcRenderer;
// Keeps track of if the view is shown
var updating;

// Update version every 50 seconds that this plugin is open
function update() {
	IPCRenderer.sendToHost('api-call', '/daemon/version', 'version');
	
	updating = setTimeout(update, 50000);
}

// Receive version
IPCRenderer.on('version', function(event, err, result) {
	if (err) {
		IPCRenderer.sendToHost('notify', '/daemon/version call failed!', 'error');
	}

	document.getElementById('siaversion').innerHTML = result;
});

// Called by the UI upon showing
function start() {
	// DEVTOOL: uncomment to bring up devtools on plugin view
	// IPCRenderer.sendToHost('devtools');
	
	// Call the API
	update();
}

// Called by the UI upon transitioning away from this view
function stop() {
	clearTimeout(updating);
}
