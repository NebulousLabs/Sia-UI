'use strict';

// Node modules
const Electron = require('electron');
const IPCRenderer = Electron.ipcRenderer;
const $ = require('jquery');
const Siad = require('sia.js');

// Hide the UI with an overlay to ensure siad is running first
const overlay = document.getElementsByClassName('overlay centered');

// Export function 
module.exports = function(initUI) {

	// Start the Sia UI and display a welcome message
	const startUI = function(welcomemsg) {
		initUI();
		document.getElementsByClassName('overlay centered').textContent = welcomemsg;
	};


	const startSiad = function() {
		//TODO...
	};
	// Check if Siad is already running and funtional on this host
	// If it is, start the UI and display a welcome message to the user
	Siad.ifRunning(startUI('Welcome back!'), startSiad());
};
