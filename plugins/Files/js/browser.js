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
const folderElement = require('./folderElement');
const loader = require('./loader');

// Root folder object to hold all other file and folder objects
var rootFolder = require('./folderFactory')('');
var currentFolder = rootFolder;
// Point of reference for shift-click multi-select
var anchor;

// Get rid of an anchor
function deselectAnchor() {
	if (anchor) {
		anchor.removeClass('anchor');
		anchor = null;
	}
}

// Make an element the anchor
function selectAnchor(el) {
	if (!el || el.length === 0) {
		return;
	}
	deselectAnchor();
	anchor = el;
	el.addClass('anchor');
	el.addClass('selected');
}

// Returns selected elements from current file list
function getSelectedElements() {
	// Get array of selected element's names (same as their ids)
	var list = $('#file-list');
	var selected = list.find('.selected.file').get();
	return selected;
}

// Returns selected files/folders from currentFolder
function getSelectedFiles() {
	return getSelectedElements().map(el => currentFolder.contents[el.id]);
}

// Refresh the file list according to the currentFolder
// TODO: folders before files, sort alphabetically
function updateList(navigateTo) {
	var list = $('#file-list');

	// Refresh the list
	// TODO: Don't empty list, update elements and add new elements if needed,
	// track untouched elements (indicates removal is needed) in an object and
	// remove if updated or created
	list.empty();
	currentFolder.contentsArray.forEach(content => {
		var el;
		if (content.type === 'file') {
			// Make and display a file element
			el = fileElement(content);
		} else if (content.type === 'folder') {
			// Make and display a folder element
			el = folderElement(content, navigateTo);
		} else {
			console.error('Unknown file type: ' + content.type, content);
		}
		list.append(el);
	});

	// Reselect all those that were selected
	var selected = getSelectedElements().forEach(el => {
		$(el).addClass('selected');
	});
}

// Update file from api result
function updateFile(result) {
	var fileFolders = result.siapath.split('/');
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
	folders.forEach(function(f, i) {
		var el = $(`
			<span class='button directory' id='dir-${f.path}'>
			</span>
		`);
		// Root folder
		if (f.path === '') {
			el.html('<i class=\'fa fa-folder\'></i>');
		} else {
			// Middle folders
			el.html(f.name);
		}

		// Last folder
		if (i === folders.length - 1) {
			el.append(' <i class=\'fa fa-caret-down\'></i>');
		} else {
			el.append('/');
		}

		// Clicking the element navigates to that folder
		el.click(function() {
			navigateTo(f);
		});

		// Append and add icon for root folder
		cwd.append(el);
	});

	// Sum up widths to move dropdown right as directory is deeper
	var cwdLength = 0;
	cwd.children().not(':last').each(function() {
		var width = Number($(this).css('width').slice(0, -2));
		cwdLength += width;
	});

	// New file/folder button appears below last folder
	cwd.children().last().off('click').click(function() {
		var dropdown = $('.hidden.dropdown');
		dropdown.css('left', cwdLength + 'px');
		dropdown.toggle('fast');
	});
}

// The browser object
var browser = {
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

	// Expose these, mostly for debugging purposes
	get currentFolder () {
		return currentFolder;
	},
	get rootFolder () {
		return rootFolder;
	},

	// Select an item in the current folder
	select (el) {
		selectAnchor(el);
	},
	toggle (el) {
		deselectAnchor();
		el.toggleClass('selected');
		if (el.hasClass('selected')) {
			selectAnchor(el);
		}
	},

	// Select items from the last selected file to the one passed in
	selectTo (el) {
		if (!anchor) {
			this.select(el);
		} else if (el.length !== 0) {
			$('#file-list .file').removeClass('selected');
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
		deselectAnchor();
		$('#file-list .file').addClass('selected');
	},

	// Deselect all items in the current folder
	deselectAll () {
		deselectAnchor();
		$('#file-list .file').removeClass('selected');
	},

	// Deletes selected files
	deleteSelected () {
		var files = getSelectedFiles();
		var itemCount = files.length;
		var label;

		// Check for any selected files, and make messages singular or plural 
		if (itemCount === 0) {
			tools.tooltip('No selected files', $('.controls .delete').get(0));
			return;
		} else if (itemCount === 1) {
			label = files[0].name;
		} else {
			let totalCount = files.reduce(function(a, b) {
				if (b.type === 'folder') {
					return a + b.count;
				} else {
					return ++a;
				}
			}, 0);
			label = totalCount + ' files';
		}

		// Confirm deletion
		var confirmation = tools.dialog('message', {
			type:    'warning',
			title:   'Confirm Deletion',
			message: `Are you sure you want to delete ${label}?`,
			detail:  'This will remove it from your library!',
			buttons: ['Okay', 'Cancel'],
		});
		if (confirmation === 1) {
			return;
		}

		// Delete files and file elements
		files.forEach(function(file) {
			file.delete(function() {
				$('#' + file.name).remove();
			});
		});
	},

	// Prompts user for destination and downloads selected files to it
	downloadSelected () {
		var files = getSelectedFiles();
		var itemCount = files.length;
		var label;
		var destination;

		// Check for any selected files, and make messages singular or plural 
		if (itemCount === 0) {
			tools.tooltip('No selected files', $('.controls .download').get(0));
			return;
		} else if (itemCount === 1) {
			// Save file/folder into specific place
			label = files[0].name;
			destination = tools.dialog('save', {
				title: 'Download ' + label,
				defaultPath: label,
			});
		} else {
			let totalCount = files.reduce(function(a, b) {
				if (b.type === 'folder') {
					return a + b.count;
				} else {
					return ++a;
				}
			}, 0);
			// Save files/folders into directory
			label = totalCount + ' files';
			destination = tools.dialog('open', {
				title: 'Download ' + label,
				properties: ['openDirectory', 'createDirectory'],
			});
		}

		// Ensure destination exists
		if (!destination) {
			return;
		}

		// Setup async calls to each file to download them
		tools.notify(`Downloading ${label} to ${destination}`, 'download');
		if (itemCount === 1) {
			files[0].download(destination, function() {
				tools.notify(`Downloaded {label} to ${destination}`, 'success');
			});
		} else {
			let functs = files.map(file => file.download);
			let destinations = files.map(file => `${destination}/${file.name}`);
			tools.waterfall(functs, destinations, function() {
				tools.notify(`Downloaded {label} to ${destination}`, 'success');
			});
		}
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
		// Ensure unique name
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
browser['Make Folder'] = browser.makeFolder;
browser['Upload File'] = function uploadFiles(filePaths, callback) {
	// Files upload to currentFolder.path/name by default
	tools.waterfall(loader.uploadFile, filePaths, currentFolder.path, callback);
};
browser['Upload Folder'] = function uploadFolders(dirPaths, callback) {
	// Uploads to currentFolder.path/name, keeping their original structure
	tools.waterfall(loader.uploadFolder, dirPaths, currentFolder.path, callback);
};
browser['Load .Sia File'] = function loadDotSias(filePaths, callback) {
	tools.waterfall(loader.loadDotSia, filePaths, callback);
};
browser['Load ASCII File'] = loader.loadAscii;

module.exports = browser;
