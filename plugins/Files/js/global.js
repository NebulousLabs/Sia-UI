'use strict';

/*
 * global.js:
 *   This file is the only js file sourced by the index.html. It defines what
 *   variables are in the DOM's global namespace, sets up button clickability,
 *   and other startup procedures for this plugin
 */

// Node modules
const path = require('path');
const BigNumber = require('bignumber.js');
const siad = require('sia.js');
const $ = require('jquery');
const loaders = require('./js/loaders');
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
// Used to hide subsequent steps when selecting an earlier one
function hideSteps(steps) {
	steps.forEach(function(step) {
		$('#step' + step).children().hide();
	});
}

// Exit function to return to general filelist view
function exitFileAdder() {
	$('#add-dir').hide();
	$('#add-file').hide();
	$('#file-library').show();

	hideSteps([2,3,'f2','f3']);

	// Clear fields
	$('.description-field').val('');
	$('.file-path, .dir-path').text('');
	lifecycle.update();
}
$('#back').click(exitFileAdder);
$('#back-dir').click(exitFileAdder);

// File list search
$('#search-bar').keypress(function() {
	tools.tooltip('Searching...', this);
	browser.filter(this.value);
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Add File ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// TODO: Get sliding frame in to work
$('#new-file').click(function() {
	$('#add-file').show();
	$('#file-library').hide();
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Upload ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Upload file option chosen
$('#upload-choice').click(function() {
	hideSteps([2,3]);
	var loadPath = tools.dialog('open', {
		title: 'Upload Path',
		properties: ['openFile'],
	});
	if (loadPath) {
		$('#nickname-file').find('.file-path').text(loadPath);
		$('#nickname-file-input').val(path.basename(loadPath));
		$('#nickname-file').show();
		$('#upload-file').show();
		// TODO: this does not work for some reason. Perhaps the view needs to
		// be refocused after the dialog box is closed.
		$('#nickname-file-input').focus();
	}
});

// An 'Enter' keypress in the input field will submit it.
$('#nickname-file-input').keyup(function(e) {
    if (e.which === 13) {
        $('#upload-file').click();
    }
});

// Upload file confirmed
$('#upload-file').click(function() {
	var loadPath = $('#nickname-file').find('.file-path').text();
	var nickname = $('#nickname-file-input').value;
	loaders.upload(loadPath, nickname, exitFileAdder);
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ .Sia file ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Sia file option chosen
$('#sia-choice').click(function() {
	hideSteps([2,3]);

	var loadPath = tools.dialog('open', {
		title: 'Sia File Path',
		filters: [
			{ name: 'Sia file', extensions: ['sia'] }
		],
		properties: ['openFile'],
	});
	if (loadPath) {
		$('#sia-file').find('.file-path').text(loadPath);
		$('#sia-file').show();
		$('#add-sia-file').show();
	}
});

// Add .sia file confirmed
$('#add-sia-file').click(function() {
	var loadPath = $('#sia-file').find('.file-path').text();
	loaders.loadDotSia(loadPath, exitFileAdder);
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ASCII code ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ASCII file option chosen
$('#ascii-choice').click(function() {
	hideSteps([2,3]);

	$('#paste-ascii').show();
	$('#paste-ascii-input').focus();
});

// An 'Enter' keypress in the input field will submit it.
$('#paste-ascii-input').keypress(function(e) {
	$('#add-ascii-file').show();
    e = e || window.event;
    if (e.keyCode === 13) {
        $('#add-ascii-file').click();
    }
});

// Add file from ascii
$('#add-ascii-file').click(function() {
	var ascii = $('#paste-ascii-input').val();
	loaders.loadAscii(ascii, exitFileAdder);
});

// Share ASCII popup
$('#copy-ascii').click(function() {
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Add directory ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Select directory sliding frame
$('#new-dir').click(function() {
	$('#add-dir').show();
	$('#file-library').hide();
});

// Upload directory option chosen
// TODO: Combine this with upload file
$('#upload-dir-choice').click(function() {
	hideSteps(['f2','f3']);

	var loadPath = tools.dialog('open', {
		title: 'Select Directory',
		properties: ['openDirectory'],
	});

	// Check that loadPath is a valid path
	if (loadPath) {
		$('#nickname-dir').find('.dir-path').text(loadPath);
		loadPath = loadPath[0].split(path.sep);
		$('#nickname-dir-input').value = loadPath[loadPath.length - 1] + '_';
		$('#nickname-dir').show();
		$('#upload-dir').show();
		$('#nickname-dir-input').focus();
	}
});

// Upload directory confirmed
$('#upload-dir').click(function() {
	var loadPath = $('#nickname-dir').find('.dir-path').text();
	var nickname = $('#nickname-dir-input').value;
	// Illegal filename characters in nickname seems to throw errors
	// So, substitute \ and / with underscore (_)
	nickname.replace(/[/\\\\]/g, '_');
	loaders.uploadDir(loadPath, nickname);
});
