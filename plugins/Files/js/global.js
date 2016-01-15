'use strict';

/*
 * global.js:
 *   This file is the only js file sourced by the index.html. It defines what
 *   variables are in the DOM's global namespace, sets up button clickability,
 *   and other startup procedures for this plugin
 */

// Node modules
const electron = require('electron');
const path = require('path');
const BigNumber = require('bignumber.js');
const siad = require('sia.js');
const $ = require('jquery');
const tools = require('./js/uiTools');
const browser = require('./js/browser');
const lifecycle = require('./js/lifecycle');

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ General ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Ensure precision
BigNumber.config({ DECIMAL_PLACES: 24 });
BigNumber.config({ EXPONENTIAL_AT: 1e+9 });

// Make sure siad settings are in sync with the rest of the UI's
siad.configure(tools.config('siad'));
// Slight modification to siad wrapper for standard error handling
siad.apiCall = function(callObj, callback) {
	siad.call(callObj, function(err, result) {
		if (err) {
			console.error(err);
			tools.notify(err.toString(), 'error');
		} else if (callback) {
			callback(result);
		}
	});
};

// Ensure browser updates once initially
browser.update();

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Buttons ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Home folder button
$('#home-folder').click(browser.navigateTo);

// File list search
$('#search-bar').keyup(function() {
	tools.tooltip('Searching...', this);
	if (this.value) {
		browser.filter(this.value);
	} else {
		browser.update();
	}
});

// Dropdown below the new button
$('.dropdown .button').click(function() {
	var userInput;
	var option = this.textContent.trim();

	// Dialog window options common to any button case that uses it
	var dialogOptions = {
		title: option,
		properties: ['multiSelections', 'createDirectory'],
	};

	// Determine which button was pressed based on the textContent
	switch (option) {
		case 'Make Folder':
			break;
		case 'Upload File':
			dialogOptions.properties.push('openFile');
			userInput = tools.dialog('open', dialogOptions);
			break;
		case 'Upload Folder':
			dialogOptions.properties.push('openDirectory');
			userInput = tools.dialog('open', dialogOptions);
			break;
		case 'Load .Sia File':
			dialogOptions.properties.push('openFile');
			dialogOptions.filters = [{ name: 'Sia file', extensions: ['sia'] }];
			userInput = tools.dialog('open', dialogOptions);
			break;
		case 'Paste ASCII File':
			$('.dropdown li').hide('fast');
			$('#paste-ascii').show('fast');
			$('#paste-ascii input').focus();
			return; // Don't close dropdown
		case 'Load ASCII File':
			userInput = $('#paste-ascii input').val();
			$('.dropdown li').show('fast');
			$('#paste-ascii').hide('fast');
			$('#paste-ascii input').val('');
			break;
		default:
			console.error('Unknown button!', this);
			return; // Don't close dropdown
	}

	// Detect flawed userInput from actions that require it, hide if fine
	if (!userInput && option !== 'Make Folder') {
		tools.tooltip('Invalid action!', this);
		return; // Don't close dropdown
	}

	// Close dropdown
	$('.dropdown').hide('fast');

	// Call the function that corresponds to the selected option
	browser[option](userInput, browser.update);
});

// Show add-ascii-file button when input box has content
$('#paste-ascii input').keypress(function(e) {
	$('#paste-ascii .button').show('fast');
	if (e.keyCode === 13) {
		$('#paste-ascii .button').click();
	}
});

// Clicking controls buttons affects selected elements
// TODO: Needs testing
$('.controls .delete').click(browser.deleteSelected);
// TODO: Need to make browser.shareSelected
$('.controls .share').click(browser.shareSelected);
$('.controls .download').click(browser.downloadSelected);
// Hide buttons to start, they're shown when files are selected
$('.controls .button').fadeOut();

// Clicking the general document closes popups, deselects files,
// and stops file name editing
$(document).on('click', function(event) {
	var el = $(event.target);
	// Clicking minimizes the dropdown
	var dropdownClicked = el.closest('.dropdown').length;
	var lastDirectoryClicked = el.closest('#cwd').length && el.closest('.directory').is(':last-child');
	if (!dropdownClicked && !lastDirectoryClicked) {
		$('.dropdown').hide('fast');
	}
	// Clicking cancels file name editing
	var fileNameClicked = el.closest('.name').length;
	var fileNameButtonClicked = el.prev('.name').length;
	if (!fileNameClicked && !fileNameButtonClicked) {
		let edited = $('.name[contentEditable=true]');
		let name = edited.attr('id');
		edited.text(name).attr('contentEditable', false);
	}
	// Don't react to button clicks past this
	var buttonClicked = el.closest('.button').length;
	if (buttonClicked) {
		browser.deselectAll();
		return;
	}
	// Clicking affects what elements are selected
	var file = el.closest('.file:not(.label)');
	var fileClicked = file.length;
	if (!fileClicked) {
		browser.deselectAll();
	} else {
		// Clicking affects selected items
		if (event.shiftKey) {
			browser.selectTo(file);
		} else if (event.ctrlKey) {
			browser.toggle(file);
		} else {
			if (fileClicked) {
				browser.select(file);
			}
			browser.deselectAll(file);
		}
	}
});
