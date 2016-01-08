'use strict';

/*
 * fileLoader namespace module:
 *   fileLoader contains the logic for uploading and loading files
 */

// Node modules
const fs = require('fs');
const path = require('path');
const tools = require('./uiTools');
const siad = require('sia.js');

// Uploads a file from the given filePath to the given virtualPath.
function uploadFile(filePath, virtualPath, callback) {
	// Determine the nickname
	var name = path.basename(filePath);
	var nickname = `${virtualPath.path}/${name}`;

	// Upload the file
	tools.notify(`Uploading ${name}!`, 'upload');
	siad.apiCall({
		url: '/renter/upload/' + nickname,
		qs: {
			source: filePath,
		},
	}, callback);
}

// Recursively upload all files in a directory
function uploadFolder(dirPath, virtualPath, callback) {
	var dirName = path.basename(dirPath);
	virtualPath = `${virtualPath}/${dirName}`;

	// Get a list of files in the chosen directory
	fs.readdir(dirPath, function(err, files) {
		if (err) {
			tools.notify('Failed retrieving directory contents', 'error');
			return;
		}

		// Setup waterfalling the async calls
		// TODO: Delegate this to uiTools.js
		var count = files.length;
		function protectCallback() {
			if (--count === 0 && callback) {
				callback();
			}
		}

		// Process files into sources and nicknames
		var filePaths = files.map(file => path.resolve(dirPath, file));
		var nicknames = files.map(file => `${virtualPath}/${file}`);
		filePaths.forEach(function(filePath, i) {
			// Appropriately upload each file/folder
			fs.stat(filePath, function(err, stats) {
				if (err) {
					tools.notify(err.message, 'error');
				} else if (stats.isFile()) {
					uploadFile(filePath, nicknames[i], protectCallback);
				} else if (stats.isDirectory()) {
					uploadFolder(filePath, virtualPath, protectCallback);
				}
			});
		});
	});
}

// Loads a .sia file into the library
function loadDotSia(filePath, callback) {
	var name = path.basename(filePath, '.sia');
	siad.apiCall({
		url: '/renter/load',
		qs: {
			filename: filePath + '.sia',
		}
	}, function(result) {
		if (callback) {
			callback(result);
		}
		// TODO: Read result.FilesAdded and interpret for notification
		tools.notify(`Added ${name}!`, 'siafile');
	});
}

// Loads an ascii represenation of a .sia file into the library
function loadAscii(ascii, callback) {
	siad.apiCall({
		url: '/renter/loadascii',
		qs: {
			file: ascii,
		}
	}, function(result) {
		if (callback) {
			callback(result);
		}
		// TODO: Read result.FilesAdded and interpret for notification
		tools.notify('Added ascii file(s)!', 'asciifile');
	});
}

module.exports = {
	uploadFile: uploadFile,
	uploadFolder: uploadFolder,
	loadAscii: loadAscii,
	loadDotSia: loadDotSia,
};
