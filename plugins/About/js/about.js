'use strict';

// Library for communicating with Sia-UI
const IPC = require('electron').ipcRenderer;
// Keeps track of if the view is shown
var updating;

// Update version every 50 seconds that this plugin is open
function update() {
	IPC.sendToHost('api-call', '/daemon/version', 'version');
	
	updating = setTimeout(update, 50000);
}

// Receive version
IPC.on('version', function(event, err, result) {
	if (err) {
		IPC.sendToHost('notify', '/daemon/version call failed!', 'error');
	}

	document.getElementById('siaversion').innerHTML = result;
});

// Called by the UI upon showing
function start() {
	// DEVTOOL: uncomment to bring up devtools on plugin view
	// IPC.sendToHost('devtools');
	
	// Call the API
	update();
}

// Called by the UI upon transitioning away from this view
function stop() {
	clearTimeout(updating);
}
