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
	el.find('.type').text('Folder');

	return el;
}

// Make folder element with jquery
function makeFolderElement(f, navigateTo) {
	var el = fileElement(f);
	el.addClass('folder');
	// add a / to distinguish folders
	el.find('.name').text(f.name + '/');

	// Populate its fields and graphics
	updateFolderElement(f, el);
	
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
