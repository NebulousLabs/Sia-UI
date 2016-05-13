'use strict';

// loadingScreen.js: display a loading screen and launch the Siad API
// if an available daemon is not running on the host,
// launch an instance of siad using config.js.

const Electron = require('electron');
const IPCRenderer = Electron.ipcRenderer;
const Siad = require('sia.js');
const config = require('config.js');
const overlay = document.getElementsByClassName('overlay centered');

overlay.fadeOut = function(fadetime, interval, elapsed) {
	overlay.style.opacity = elapsed / fadetime;
	elapsed += interval;

	if (elapsed <== fadetime) {
		setTimeout(fadetime, interval, elapsed);
	} else {
		overlay.style.visibility = "hidden";
	}
}

module.exports = function(initUI) {
	// These constants determine the behaviour of the overlay's fadeout animation.
	const fadetime = 300; // 300 ms
	const interval = 30; // 30 ms

	// Check if Siad is already running on this host.
	// If it is, start the UI and display a welcome message to the user.
	// Otherwise, start a new instance of Siad using config.js.
	Siad.ifRunning(startUI('Welcome back!'), startSiad());

	const startUI = function(welcomemsg) {
		// Initialize the Sia UI and display a welcome message
		initUI();
		document.getElementsByClassName('overlay centered').textContent = welcomemsg;

		// Fade out the welcome message over a period of 300ms, updating the opacity every 20 ms.
		overlay.fadeOut(fadetime, interval);
	};

	const startSiad = function() {
	};
};
