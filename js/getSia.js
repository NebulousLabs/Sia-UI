'use strict';

// This script, much like how the name says, downloads a Sia release into the
// UI's root directory.
const SiadWrapper = require('sia.js');
const Path = require('path');
const Fs = require('fs');

var defaultSiaFolder = Path.join(__dirname, '..', 'Sia');
// Check if folder already exists
Fs.stat(defaultSiaFolder, function(err, stats) {
	if (err) {
		// Folder doesn't exist
		SiadWrapper.download(defaultSiaFolder);
	} else if (stats.isDirectory()) {
		// Folder exists, check if it's empty
		Fs.readdir(defaultSiaFolder, function(err, files) {
			if (!err && files.length === 0) {
				SiadWrapper.download(defaultSiaFolder);
			}
		});
	}
});
