'use strict';

// Library for communicating with Sia-UI
const electron = require('electron');

// Set UI version via package.json.
document.getElementById('uiversion').innerHTML = require('../../package.json').version;

// Set daemon version via API call.
SiaAPI.call('/daemon/version', function(err, result) {
	if (err) {
		SiaAPI.showError('Error', err.toString())
		ipcRenderer.sendToHost('notification', err.toString(), 'error');
	} else {
		document.getElementById('siaversion').innerHTML = result.version;
	}
});

// Make FAQ button launch the FAQ webpage.
document.getElementById('faq').onclick = function() {
	electron.shell.openExternal('http://sia.tech/faq');
};
