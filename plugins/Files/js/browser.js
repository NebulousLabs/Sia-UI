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

// Filter file list by search string
// TODO: only searches the current folder for now
function filterList(searchstr) {
	$('#file-list').children().each(function(entry) {
		if ($(this).find('.name').html().indexOf(searchstr) > -1) {
			entry.show();
		} else {
			entry.hide();
		}
	});
}

// Refresh the file list according to the currentFolder
function updateList() {
	var list = $('#file-list');
	list.children().filter(function() {
		// Don't clear empty folders, they're not represented in renter/files/list
		var entry = $(this);
		return !(entry.hasClass('folder') && entry.find('.size').text() === 'empty');
	}).remove();
	Object.keys(currentFolder.contents).forEach(function(contentName) {
		var entity = currentFolder.contents[contentName];
		if (entity.type === 'file') {
			// Make and display a file element
			list.append(fileElement(entity));
		} else if (entity.type === 'folder') {
			// Make and display a folder element
			list.append(folderElement(entity));
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
function updateCWD() {
	var cwd = $('#cwd');
	cwd.empty();
	var folders = currentFolder.folders;

	// Add an icon for the root folder
	var rootIcon = $(`	<span class='button directory'>
							<i class='fa fa-folder'></i>
						</span>`);
	rootIcon.click(function() {
		currentFolder = rootFolder;
		updateList();
	});
	cwd.append(rootIcon);

	// Add a directory element per folder
	folders.forEach(function(folder) {
		let el = $(`<span class='button directory'>${folder.name}</span>`);
		// Clicking the element navigates to that folder
		el.click(function() {
			currentFolder = folder;
			updateList();
		});
		cwd.append(el);
	});
}

// Update files in the browser
function updateBrowser() {
	// TODO: This call doesn't always include a file added right before the
	// call to this function. Waiting 100ms provides a not-noticeable delay and
	// allows siad time to provide an up to date list, but is flawed
	setTimeout(function() {
		siad.apiCall('/renter/files/list', function(results) {
			// Update the current working directory
			updateCWD();
			// Add or update each file from a `renter/files/list` call
			results.forEach(updateFile);
			// Update the file list
			updateList();
		});
	}, 100);
}

// Makes a new folder element temporarily
function makeFolder() {
	var name = 'New Folder';
	if (currentFolder.contents[name]) {
		var n = 0;
		while (currentFolder.contents[`${name}_${n}`]) {
			n++;
		}
		name = `${name}_${n}`;
	}
	var folder = currentFolder.addFolder(name);
	var element = folderElement(folder);
	$('#file-list').append(element);
}

// Uploads a file from the given filePath
function upload(filePath, callback) {
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
		updateBrowser();
		tools.notify(`Uploaded ${name}!`, 'upload');
	});
}

// Checks whether a path starts with or contains a hidden file or a folder.
function isUnixHiddenPath(path) {
	return (/(^|\/)\.[^\/\.]/g).test(path);
}

// Non-recursively upload all files in a directory
// TODO: Make recursive
function uploadFolder(dirPath, callback) {
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
					upload(filePath);
				}
			});
		});
	});
}

function loadDotSia(filePath, callback) {
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
		updateBrowser();
		// TODO: Read result.FilesAdded and interpret for notification
		tools.notify(`Added ${name}!`, 'siafile');
	});
}

function loadAscii(ascii, callback) {
	siad.apiCall({
		url: '/renter/files/loadascii',
		qs: {
			file: ascii,
		}
	}, function(result) {
		if (callback) {
			callback(result);
		}
		updateBrowser();
		// TODO: Read result.FilesAdded and interpret for notification
		tools.notify('Added ascii file(s)!', 'asciifile');
	});
}

module.exports = {
	update: updateBrowser,
	filter: filterList,
	makeFolder: makeFolder,
	upload: upload,
	uploadFolder: uploadFolder,
	loadDotSia: loadDotSia,
	loadAscii: loadAscii,
};
