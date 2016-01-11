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

// Uploads a file from the given source to the given virtualPath.
function uploadFile(source, virtualPath, callback) {
	// Determine the nickname
	var name = path.basename(source);
	var nickname = `${virtualPath}/${name}`;

	// Upload the file
	tools.notify(`Uploading ${name}!`, 'upload');
	siad.apiCall({
		url: '/renter/upload/' + nickname,
		method: 'POST',
		qs: {
			source: source,
			renew: true,
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

		// Process files into sources and nicknames
		var filePaths = files.map(file => path.resolve(dirPath, file));
		// Process the appropriate function per file
		var functs = filePaths.map(filePath =>
			fs.statSync(filePath).isFile() ? uploadFile : uploadFolder);
		tools.waterfall(functs, virtualPath, callback);
	});
}

// Loads a .sia file into the library
function loadDotSia(source, callback) {
	var name = path.basename(source, '.sia');
	siad.apiCall({
		url: '/renter/load',
		method: 'POST',
		qs: {
			source: source,
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
		method: 'POST',
		qs: {
			asciisia: ascii,
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
