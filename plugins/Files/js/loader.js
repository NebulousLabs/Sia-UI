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

// Whether to upload files with autorenew feature or some block duration
// Default behavior is to renew automatically
// TODO: Settings page
var renew = true;
var duration = null;

// Get files plugin settings for uploading
var settings = tools.config('files');
if (!settings) {
	tools.config('files', {
		renew: renew,
		duration: duration,
	});
} else {
	renew = settings.renew;
	duration = settings.duration;
}

// Uploads a file from the given source to the given siapath.
function uploadFile(source, siapath, callback) {
	// Determine the siapath
	var fileName = path.basename(source);
	if (siapath !== '') {
		siapath = `${siapath}/${fileName}`;
	} else {
		siapath = fileName;
	}

	// Upload the file
	siad.apiCall({
		url: '/renter/upload/' + siapath,
		method: 'POST',
		qs: {
			source: source,
			duration: duration,
			renew: renew,
		},
	}, callback);
}

// Recursively upload all files in a directory
function uploadFolder(dirPath, siapath, callback) {
	var dirName = path.basename(dirPath);
	if (siapath !== '') {
		siapath = `${siapath}/${dirName}`;
	} else {
		siapath = dirName;
	}

	// Get a list of files in the chosen directory
	fs.readdir(dirPath, function(err, files) {
		if (err) {
			tools.notify('Failed retrieving directory contents', 'error');
			return;
		}

		// Process files into sources and siapaths
		var filePaths = files.map(file => path.resolve(dirPath, file));
		// Process the appropriate function per file
		var functs = filePaths.map(filePath =>
			fs.statSync(filePath).isFile() ? uploadFile : uploadFolder);
		tools.waterfall(functs, filePaths, siapath, callback);
	});
}

// Loads a .sia file into the library
function loadDotSia(source, callback) {
	siad.apiCall({
		url: '/renter/load',
		method: 'POST',
		qs: {
			source: source,
		}
	}, callback);
}

// Loads an ascii represenation of a .sia file into the library
function loadAscii(ascii, callback) {
	siad.apiCall({
		url: '/renter/loadascii',
		method: 'POST',
		qs: {
			asciisia: ascii,
		}
	}, callback);
}

// Place one .sia file to destination for potentially many file paths
function shareDotSia(paths, destination, callback) {
	siad.apiCall({
		url: '/renter/share',
		qs: {
			siapaths: paths.join(','),
			destination: destination,
		}
	}, callback);
}

// Share one .sia ascii for potentially many file paths
function shareAscii(paths, callback) {
	siad.apiCall({
		url: '/renter/shareascii',
		qs: {
			siapaths: paths.join(','),
		}
	}, callback);
}

module.exports = {
	uploadFile: uploadFile,
	uploadFolder: uploadFolder,
	loadDotSia: loadDotSia,
	loadAscii: loadAscii,
	shareDotSia: shareDotSia,
	shareAscii: shareAscii,
};
