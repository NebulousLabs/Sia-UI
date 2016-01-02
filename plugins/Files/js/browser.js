'use strict';

/*
 * browser:
 *   browser is the manager that renders file/folder elements and navigates
 *   through a user's sia files
 */

// Node modules
const fs = require('fs');
const path = require('path');
const $ = require('jquery');
const siad = require('sia.js');
const tools = require('./uiTools');
const fileElement = require('./fileElement');
const folderElement = require('./folderElement');

// Root folder object to hold all other file and folder objects
var rootFolder = require('./folder')('');
var currentFolder = rootFolder;

// Refresh the file list according to the currentFolder
function updateList(navigateTo) {
	var list = $('#file-list');
	list.empty();
	Object.keys(currentFolder.contents).forEach(function(contentName) {
		var entity = currentFolder.contents[contentName];
		if (entity.type === 'file') {
			// Make and display a file element
			list.append(fileElement(entity));
		} else if (entity.type === 'folder') {
			// Make and display a folder element
			list.append(folderElement(entity, navigateTo));
		} else {
			console.error('Unknown entity type: ' + entity.type, entity);
		}
	});
}

// Update file from api result
function updateFile(result) {
	var fileFolders = result.Nickname.split('/');
	var fileName = fileFolders.pop();

	// Make any needed folders
	var folderIterator = rootFolder;
	fileFolders.forEach(function(folderName) {
		// Continue to next folder or make folder if it doesn't already exist
		folderIterator = folderIterator.contents[folderName] ? folderIterator.contents[folderName] : folderIterator.addFolder(folderName);
	});

	// Make file if needed
	if (!folderIterator.contents[fileName]) {
		folderIterator.addFile(result);
	} else {
		// Update the stats on the file object
		folderIterator.contents[fileName].update(result);
	}
}

// Refresh the folder list representing the current working directory
function updateCWD(navigateTo) {
	var cwd = $('#cwd');
	cwd.empty();
	var folders = currentFolder.parentFolders;
	folders.push(currentFolder);

	// Add a directory element per folder
	// TODO: This adds a textless button for the root folder, which is flawed
	// Could be more elegant.
	folders.forEach(function(folder) {
		let el = $('#home-folder').clone().html(folder.name);
		// Clicking the element navigates to that folder
		el.click(function() {
			navigateTo(folder);
		});
		cwd.append(el);
	});
}

// Checks whether a path starts with or contains a hidden file or a folder.
function isUnixHiddenPath(path) {
	return (/(^|\/)\.[^\/\.]/g).test(path);
}

// The browser object
var browser = {
	// Update files in the browser
	update () {
		// TODO: This call doesn't always include a file added right before the
		// call to this function. Waiting 100ms provides a not-noticeable delay and
		// allows siad time to provide an up to date list, but is flawed
		setTimeout(function() {
			siad.apiCall('/renter/files/list', function(results) {
				// Update the current working directory
				updateCWD(browser.navigateTo);
				// Add or update each file from a `renter/files/list` call
				results.forEach(updateFile);
				// Update the file list
				updateList(browser.navigateTo);
			});
		}, 100);
	},
	// Filter file list by search string
	// TODO: only searches the current folder for now
	filter (searchstr) {
		$('#file-list').children().each(function(entry) {
			if ($(this).find('.name').html().indexOf(searchstr) > -1) {
				entry.show();
			} else {
				entry.hide();
			}
		});
	},
	// Navigate to a given folder or rootFolder by default
	navigateTo (folder) {
		folder = folder.type === 'folder' ? folder : rootFolder;
		currentFolder = folder;
		browser.update();
	},
	// Makes a new folder element temporarily
	makeFolder () {
		var name = 'New Folder';
		if (currentFolder.contents[name]) {
			var n = 0;
			while (currentFolder.contents[`${name}_${n}`]) {
				n++;
			}
			name = `${name}_${n}`;
		}
		var folder = currentFolder.addFolder(name);
		var element = folderElement(folder, browser.navigateTo);
		$('#file-list').append(element);
	},
	// Uploads a file from the given filePath
	upload (filePath, callback) {
		// Include the current folder's path in the nickname
		var name = path.basename(filePath);
		var nickname = `${currentFolder.path}/${name}`;
		siad.apiCall({
			url: '/renter/files/upload',
			qs: {
				source: filePath,
				nickname: nickname,
			},
		}, function(result) {
			if (callback) {
				callback(result);
			}
			browser.update();
			tools.notify(`Uploaded ${name}!`, 'upload');
		});
	},
	// Non-recursively upload all files in a directory
	// TODO: Make recursive
	uploadFolder (dirPath, callback) {
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
						tools.notify(`Cannot read ${file}!`, 'error');
						return;
					}
					if (!isUnixHiddenPath(filePath) && stats.isFile()) {
						browser.upload(filePath);
					}
				});
			});
		});
	},
	loadDotSia (filePath, callback) {
		var name = path.basename(filePath, '.sia');
		siad.apiCall({
			url: '/renter/files/load',
			qs: {
				filename: filePath,
			}
		}, function(result) {
			if (callback) {
				callback(result);
			}
			browser.update();
			// TODO: Read result.FilesAdded and interpret for notification
			tools.notify(`Added ${name}!`, 'siafile');
		});
	},
	loadAscii (ascii, callback) {
		siad.apiCall({
			url: '/renter/files/loadascii',
			qs: {
				file: ascii,
			}
		}, function(result) {
			if (callback) {
				callback(result);
			}
			browser.update();
			// TODO: Read result.FilesAdded and interpret for notification
			tools.notify('Added ascii file(s)!', 'asciifile');
		});
	},
};

module.exports = browser;
