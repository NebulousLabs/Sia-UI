'use strict';

/*
 * browser:
 *   browser is the manager that renders file/folder elements and navigates
 *   through a user's sia files
 */

// Node modules
const $ = require('jquery');
const file = require('./file');
const addFile = require('./fileElement');
const folder = require('./folder');

// Root folder object to hold all other file and folder objects
var rootFolder = folder('');
var currentFolder = rootFolder;

// Update file
function updateFile(result) {
	var fileFolders = result.Nickname.split('/');
	var fileName = fileFolders.pop();
	var currentFolders = currentFolder.folders;
	var depth = currentFolders.length;

	// Don't need to account for files not inside the current scope
	for (let i = 0; i < depth; i++) {
		if (currentFolders[i] !== fileFolders[i]) {
			return;
		}
	}

	// Check if file is in a deeper level
	if (depth < fileFolders.length) {
		var subFolderName = fileFolders[depth];
		// Make folder for file if needed
		if (!currentFolder.contents[subFolderName]) {
			var subFolderPath = fileFolders.slice(0, depth + 1).join('/');
			var newFolder = folder(subFolderPath);
			currentFolder.contents[subFolderName] = newFolder;
		}
		// Don't need to update this file since it's in a deeper level
		return;
	}

	// Create files that don't already exist
	if (!currentFolder.contents[fileName]) {
		currentFolder.contents[fileName] = file(result);
	}

	// Make and display file element
	var f = currentFolder.contents[fileName];
	$('#file-browser').append(addFile(f));
}

// Filter file list by search string
function filterList(searchstr) {
	$('#file-browser').children().each(function(entry) {
		if ($(this).find('.name').html().indexOf(searchstr) > -1) {
			entry.show();
		} else {
			entry.hide();
		}
	});
}

// Refresh file list
function updateList(results) {
	$('#file-browser').empty();

	// Add each file
	results.forEach(updateFile);
}

module.exports = {
	update: updateList,
	filter: filterList,
};
