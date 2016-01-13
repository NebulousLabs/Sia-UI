'use strict';

/*
 * folderElement function module:
 *   This module holds the creation logic for folder elements.
 */

// Node modules
const $ = require('jquery');
const BigNumber = require('bignumber.js');
const tools = require('./uiTools');
const fileElement = require('./fileElement');

// Update file element with jquery
function updateFolderElement(f, el) {
	el = el || $('#' + f.hashedPath);

	// Set size as empty if there are no files
	if (f.isEmpty()) {
		el.find('.size').text('empty');
		el.find('.detail').text('--');
	} else {
		el.find('.detail').text(f.count + ' items');
	}

	return el;
}

// Make folder element with jquery
function makeFolderElement(f, navigateTo) {
	var el = fileElement(f);
	el.addClass('folder');

	// Populate its fields and graphics
	updateFolderElement(f, el);
	
	// Share button, when clicked, downloads .sia files to specified location
	// with the same structure as in the browser
	/* TODO: move to browser for aggregate action
	el.find('.share').click(function() {
		var destination = tools.dialog('save', {
			title:       `Share ${f.name}'s .sia files'`,
			defaultPath: f.name,
		});

		// Download siafiles to location
		f.share(destination, function() {
			tools.notify(`Put ${f.name}'s .sia files at ${destination}`, 'download');
		});
	});
	*/

	// Navigate to the folder if the element, not its buttons, is clicked
	el.off('dblclick');
	el.dblclick(function(e) {
		if (!$(e.target).is('.button, .fa')) {
			navigateTo(f);
		}
	});

	// Return the new element
	return el;
}

module.exports = function(f, funct) {
	// Determine to update or add a folder element based on if it exists already
	if (!$('#' + f.hashedPath).length) {
		return makeFolderElement(f, funct);
	} else {
		return updateFolderElement(f);
	}
};
