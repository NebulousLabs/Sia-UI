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
const addFolder = require('./folderElement');

// Root folder object to hold all other file and folder objects
var rootFolder = folder('');
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

// Refresh the view according to the currentFolder
function updateList() {
	$('#file-list').empty();
	Object.keys(currentFolder.contents).forEach(function(contentName) {
		var entity = currentFolder.contents[contentName];
		if (entity.type === 'file') {
			// Make and display a file element
			$('#file-list').append(addFile(entity));
		} else if (entity.type === 'folder') {
			// Make and display a folder element
			$('#file-list').append(addFolder(entity));
		} else {
			console.error('Unknown entity type', entity);
		}
	});
}

// Update file from api result
function updateFile(result) {
	var fileFolders = result.Nickname.split('/');
	var fileName = fileFolders.pop();

	// Make any needed folders
	var tempFolder = rootFolder;
	for (let i = 0; i < fileFolders.length; i++) {
		var folderName = fileFolders[i];
		// Make folder if it doesn't already exist
		if (!tempFolder.contents[folderName]) {
			let folderPath = fileFolders.slice(0, i + 1).join('/');
			tempFolder.contents[folderName] = folder(folderPath);
		}
		// Continue to next folder
		tempFolder = tempFolder.contents[folderName];
	}

	// Make file if needed
	if (!tempFolder.contents[fileName]) {
		tempFolder.contents[fileName] = file(result);
	} else {
		// Update the stats on the file object
		tempFolder.contents[fileName].update(result);
	}
}

// Update files in the browser
function updateBrowser(results) {
	// Add or update each file
	results.forEach(updateFile);
	updateList();
}

module.exports = {
	update: updateBrowser,
	filter: filterList,
};
