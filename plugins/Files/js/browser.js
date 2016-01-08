'use strict';

/*
 * browser instance module:
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
const loader = require('./loader');
const folderElement = require('./folderElement');

// Root folder object to hold all other file and folder objects
var rootFolder = require('./folderFactory')('');
var currentFolder = rootFolder;
// Point of reference for shift-click multi-select
var anchor;

// Refresh the file list according to the currentFolder
function updateList(navigateTo) {
	var list = $('#file-list');

	// Get array of selected element's ids (same as their names)
	var selected = list.find('.selected.entity').get();
	selected = selected.map(el => el.id);

	// Refresh the list
	list.empty();
	currentFolder.contentsArray.forEach(function(content) {
		var el;
		if (content.type === 'file') {
			// Make and display a file element
			el = fileElement(content);
		} else if (content.type === 'folder') {
			// Make and display a folder element
			el = folderElement(content, navigateTo);
		} else {
			console.error('Unknown entity type: ' + content.type, content);
		}

		// If it was previously selected, mark it so
		if (selected.indexOf(content.name) !== -1) {
			el.addClass('selected');
		}

		list.append(el);
	});
}

// Update file from api result
function updateFile(result) {
	var fileFolders = result.nickname.split('/');
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
	folders.forEach(function(f) {
		var el = $(`
			<span class='button directory' id='dir-${f.path}'>
				${f.name}/
			</span>
		`);

		// Clicking the element navigates to that folder
		el.click(function() {
			navigateTo(f);
		});

		// Append and add icon for root folder
		cwd.append(el);
		if (f.path === '') {
			el.prepend('<i class=\'fa fa-folder\'></i>');
		}
	});

	// New file/folder button
	var cwdLength = 0;
	cwd.children().not(':last').each(function() {
		var width = Number($(this).css('width').slice(0, -2));
		cwdLength += width;
	});
	cwd.children().last().click(function() {
		var dropdown = $('.hidden.dropdown');
		dropdown.css('left', cwdLength + 'px');
		dropdown.toggle('fast');
	});
}

// The browser object
var browser = {
	// Expose these, mostly for debugging purposes
	get currentFolder () {
		return currentFolder;
	},
	get rootFolder () {
		return rootFolder;
	},

	// Select an item in the current folder
	select (el) {
		if (el.length === 0) {
			return;
		}
		anchor = el;
		el.addClass('selected');
	},
	toggle (el) {
		el.toggleClass('selected');
		if (el.hasClass('selected')) {
			anchor = el;
		}
	},

	// Select items from the last selected entity to the one passed in
	selectTo (el) {
		if (!anchor) {
			this.select(el);
		} else if (el.length !== 0) {
			$('#file-list .entity').removeClass('selected');
			anchor.addClass('selected');
			el.addClass('selected');
			if (el.index() > anchor.index()) {
				anchor.nextUntil(el).addClass('selected');
			} else {
				el.nextUntil(anchor).addClass('selected');
			}
		}
	},

	// Select all items in the current folder
	selectAll () {
		anchor = null;
		$('#file-list .entity').addClass('selected');
	},

	// Deselect all items in the current folder
	deselectAll () {
		anchor = null;
		$('#file-list .entity').removeClass('selected');
	},

	// Update files in the browser
	update () {
		// TODO: This call doesn't always include a file added right before the
		// call to this function. Waiting 100ms provides a not-noticeable delay and
		// allows siad time to provide an up to date list, but is flawed
		setTimeout(function() {
			siad.apiCall('/renter/files', function(results) {
				// Update the current working directory
				updateCWD(browser.navigateTo);
				// Add or update each file from a `renter/files/list` call
				results.files.forEach(updateFile);
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
};

// Redirects dropdown options (see global.js) to their respective functions
browser.Folder = browser.makeFolder;
browser['File Upload'] = function uploadFiles(filePaths, callback) {
	// Files upload to currentFolder.path/name by default
	tools.waterfall(loader.uploadFile, filePaths, currentFolder.path, callback);
};
browser['Folder Upload'] = function uploadFolders(dirPaths, callback) {
	// Uploads to currentFolder.path/name, keeping their original structure
	tools.waterfall(loader.uploadFolder, dirPaths, currentFolder.path, callback);
};
browser['.Sia File'] = function loadDotSias(filePaths, callback) {
	tools.waterfall(loader.loadDotSia, filePaths, callback);
};
browser['Add ASCII File'] = browser.loadAscii;

module.exports = browser;
