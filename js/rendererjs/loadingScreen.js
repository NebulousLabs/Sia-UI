'use strict';

// Node modules
const Electron = require('electron');
const IPCRenderer = Electron.ipcRenderer;
const $ = require('jquery');

// Hide the UI with an overlay to ensure siad is running first
var overlay = $('.overlay');

// Update the user on siad's progress, but show a crash screen if no signal
// from siad for too long
var crashClock;
function crash(err) {
	var crashText = 'Siad has stopped responding: ' + err;
	overlay.find('.centered').text(crashText);
	IPCRenderer.removeAllListeners('siad');
}

// Crash after .3s because after sending a 'loading' or 'unloading' signal, the
// main process should be sending a signal every .1s
function delayCrash() {
	overlay.find('p').text('Loading Sia...');
	clearTimeout(crashClock);
	crashClock = setTimeout(crash, 300);
}

// Export function 
module.exports = function(initUI) {
	// When siad successfully loads, hide the overlay and start the UI
	function showUI(msg) {
		IPCRenderer.removeAllListeners('siad');
		initUI();
	
		// Display success text
		overlay.find('.centered').text(msg);
		clearTimeout(crashClock);
		setTimeout(function() {
			overlay.fadeOut('slow');
		}, 300);
	}

	IPCRenderer.on('siad', function(e, signal, arg0, arg1) {
		switch (signal) {
			case 'started':
				showUI('Hello!');
				break;
			case 'running':
				showUI('Hello again!');
				break;
			case 'loading':
				delayCrash();
				break;
			case 'exit':
			case 'failure':
				crash(arg0);
				break;
			default:
				// For piped child process events, notify
				var eventmsg = `siad ${signal}: ${arg0 || ''} ${arg1 || ''}`;
				ui.notify(eventmsg, signal);
		}
	});
};
