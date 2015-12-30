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
			console.error(callObj, err);
			tools.notify(err.toString(), 'error');
		} else if (callback) {
			callback(result);
		}
	});
};

// Make lifecycle.start|stop global functions
var start = lifecycle.start;
var stop = lifecycle.stop;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Buttons ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// File list search
$('#search-bar').keypress(function() {
	tools.tooltip('Searching...', this);
	browser.filter(this.value);
});

// New file/folder button
$('#new.button').click(function() {
	$('.hidden.dropdown').toggle('fast');
});

// Dropdown below the new button
$('.dropdown .button').click(function() {
	var userInput;
	var option = this.textContent.trim();
	switch (option) {
		case 'Folder':
			browser.makeFolder();
			break;
		case 'File Upload':
			userInput = tools.dialog('open', {
				title: 'Upload File',
				properties: ['openFile'],
			})[0];
			if (userInput) {
				browser.upload(userInput);
			}
			break;
		case 'Folder Upload':
			userInput = tools.dialog('open', {
				title: 'Upload Folder',
				properties: ['openDirectory'],
			})[0];
			if (userInput) {
				browser.uploadFolder(userInput);
			}
			break;
		case '.Sia File':
			userInput = tools.dialog('open', {
				title: 'Load .sia File',
				filters: [
					{ name: 'Sia file', extensions: ['sia'] }
				],
				properties: ['openFile'],
			})[0];
			if (userInput) {
				browser.loadDotSia(userInput);
			}
			break;
		case 'ASCII File':
			$('.dropdown li').hide('fast');
			$('#paste-ascii').show('fast');
			$('#paste-ascii input').focus();
			return;
		case 'Add ASCII File':
			var ascii = $('#paste-ascii input').val();
			if (ascii) {
				browser.loadASCII(ascii);
			}
			$('.dropdown li').show('fast');
			$('#paste-ascii').hide('fast');
			break;
		default:
			console.error('Unknown button!', this);
			break;
	}
	if (!userInput && option !== 'Folder') {
		tools.tooltip('Invalid action!', this);
	} else {
		$('.dropdown').hide('fast');
		browser.update();
	}
});

// Show add-ascii-file button when input box has content
$('#paste-ascii input').keypress(function(e) {
	$('#paste-ascii .button').show('fast');
	if (e.keyCode === 13) {
		$('#paste-ascii .button').click();
	}
});
