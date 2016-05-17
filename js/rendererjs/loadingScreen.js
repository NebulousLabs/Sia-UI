'use strict';

// loadingScreen.js: display a loading screen until communication with Siad has been established.
// if an available daemon is not running on the host,
// launch an instance of siad using config.js.

const remote = require('electron').remote;
const IPCRenderer = require('electron').ipcRenderer;
const Siad = require('sia.js');
const config = IPCRenderer.sendSync('config', 'siad');
Siad.configure(config);

const overlay = document.getElementsByClassName('overlay')[0];
const overlayText = overlay.getElementsByClassName('centered')[0].getElementsByTagName('p')[0];
overlayText.textContent = 'Loading Sia...';

const showError = (error) => {
	overlayText.textContent = 'A Sia-UI error has occured: ' + error;
};

// startUI starts a Sia UI instance using the given welcome message.
// calls initUI() after displaying a welcome message.
const startUI = (welcomemsg, initUI) => {
	// Display a welcome message, then initialize the ui
	overlayText.innerHTML = welcomemsg;
	initUI();
	overlay.style.display = 'none';
};

// startSiad configures and starts a Siad instance.
// callback is called on successful start.
const startSiad = (callback) => {
	Siad.configure(config, (error) => {
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
	Siad.ifRunning(() => {
		config.detached = true;
		IPCRenderer.sendSync('config', 'siad', config);
		Siad.configure(config);
		startUI('Welcome back', initUI);
	}, () => {
		config.detached = false;
		IPCRenderer.sendSync('config', 'siad', config);
		startSiad((error) => {
			if (error) {
				console.error(error);
			} else {
				startUI('Welcome to Sia', initUI);
			}
		});
	});
};
