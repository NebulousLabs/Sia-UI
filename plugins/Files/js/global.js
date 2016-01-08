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

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Buttons ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Home folder button
$('#home-folder').click(browser.navigateTo);

// File list search
$('#search-bar').keypress(function() {
	tools.tooltip('Searching...', this);
	browser.filter(this.value);
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
		case 'Folder':
			break;
		case 'File Upload':
			dialogOptions.properties.push('openFile');
			userInput = tools.dialog('open', dialogOptions);
			break;
		case 'Folder Upload':
			dialogOptions.properties.push('openDirectory');
			userInput = tools.dialog('open', dialogOptions);
			break;
		case '.Sia File':
			dialogOptions.properties.push('openFile');
			dialogOptions.filters = [{ name: 'Sia file', extensions: ['sia'] }];
			userInput = tools.dialog('open', dialogOptions);
			break;
		case 'ASCII File':
			$('.dropdown li').hide('fast');
			$('#paste-ascii').show('fast');
			$('#paste-ascii input').focus();
			return; // Don't close dropdown
		case 'Add ASCII File':
			userInput = $('#paste-ascii input').val();
			$('.dropdown li').show('fast');
			$('#paste-ascii').hide('fast');
			$('#paste-ascii input').empty();
			break;
		default:
			console.error('Unknown button!', this);
			return; // Don't close dropdown
	}

	// Detect flawed userInput from actions that require it, hide if fine
	if (!userInput && option !== 'Folder') {
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

// Clicking within the file-list affects what elements are selected
$('#file-browser').click(function(e) {
	e.preventDefault();
	var el = $(e.target);
	var entity = el.closest('.entity');

	// Don't react to button clicks
	var buttonClicked = el.hasClass('button') || el.parent().hasClass('button');
	if (buttonClicked) {
		return;
	}

	if (e.shiftKey) {
		browser.selectTo(entity);
	} else if (e.ctrlKey) {
		browser.toggle(entity);
	} else {
		browser.deselectAll();
		browser.select(entity);
	}
});

