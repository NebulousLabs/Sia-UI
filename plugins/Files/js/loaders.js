'use strict';

// Node modules
const fs = require('fs');
const path = require('path');
const siad = require('sia.js');
const tools = require('./uiTools');

function upload(filePath, nickname, callback) {
	tools.notify('Uploading ' + nickname + ' to Sia Network', 'upload');
	siad.apiCall({
		url: '/renter/files/upload',
		qs: {
			source: filePath,
			nickname: nickname,
		},
	}, callback);
}

// Checks whether a path starts with or contains a hidden file or a folder.
function isUnixHiddenPath(path) {
	return (/(^|\/)\.[^\/\.]/g).test(path);
}

// Non-recursively upload all files in a directory
function uploadDir(dirPath, nickname, callback) {
	// Upload files one at a time
	fs.readdir(dirPath, function(err, files) {
		if (err) {
			tools.notify('Failed retrieving directory contents', 'error');
			return;
		}
		files.forEach(function(file) {
			var filePath = path.join(dirPath, file);

			// Skip hidden files and directories
			fs.stat(filePath, function(err, stats) {
				if (err) {
					tools.notify('Cannot read ' + file, 'error');
					return;
				}
				if (!isUnixHiddenPath(filePath) && stats.isFile()) {
					upload(filePath, nickname + file);
				}
			});
		});
	});
}

function loadDotSia(filePath, callback) {
	tools.notify('Adding ' + path.basename(filePath) + ' to library', 'siafile');
	siad.apiCall({
		url: '/renter/files/load',
		qs: {
			filename: filePath,
		}
	}, callback);
}

function loadAscii(ascii, callback) {
	tools.notify('Adding file(s) to library', 'asciifile');
	siad.apiCall({
		url: '/renter/files/loadascii',
		qs: {
			file: ascii,
		}
	}, callback);
}

module.exports = {
	upload: upload,
	uploadDir: uploadDir,
	loadDotSia: loadDotSia,
	loadAscii: loadAscii,
};
