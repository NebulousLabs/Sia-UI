'use strict';

// loadingScreen.js: display a loading screen and launch the Siad API
// if an available daemon is not running on the host,
// launch an instance of siad using config.js.

const remote = require('electron').remote;
const Siad = require('sia.js');
const Path = require('path');
var config = remote.require('./js/mainjs/config.js')(Path.resolve('config.json'));
config.path = Path.resolve('Sia');
const overlay = document.getElementsByClassName('overlay')[0];
const overlayText = overlay.getElementsByClassName('centered')[0].getElementsByTagName('p')[0];

const showError = function(error) {
	overlayText.textContent = 'A Sia-UI error has occured: ' + error;
};

// startUI starts a Sia UI instance using the given welcome message.
// calls initUI() on after displaying a welcome message
const startUI = function(welcomemsg, initUI) {
	// Display a welcome message, then initialize the ui
	overlayText.innerHTML = welcomemsg;
	initUI();
	overlay.style.display = 'none';
};

// startSiad configures and starts a Siad instance.
// callback is called on successful start.
const startSiad = function(callback) {
	Siad.configure(config, function(error) {
		if (error) {
			console.error(error);
			overlay.showError(error);
		} else {
			Siad.start(callback);

		}
	});
};

// Check if Siad is already running on this host.
// If it is, start the UI and display a welcome message to the user.
// Otherwise, start a new instance of Siad using config.js.
module.exports = function(initUI) {
	Siad.ifRunning(function() {
		config.siad.detached = true;
		Siad.configure(config);
		startUI('Welcome back', initUI);
	}, function() {
		startSiad(function(error) {
			if (error) {
				console.error(error);
			} else {
				startUI('Welcome to Sia', initUI);
			}
		});
	});
};
