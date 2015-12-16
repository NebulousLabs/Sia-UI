'use strict';

// Library for working with clipboard
const Clipboard = require('clipboard');

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ General ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Used to hide subsequent steps when selecting an earlier one
function hideSteps(steps) {
	steps.forEach(function(step) {
		var c = $('#step' + step).children;
		for (var i = 0; i < c.length; i++) {
			if(!hidden(c[i])) {
				hide(c[i]);
			}
		}
	});
}

// Exit function to return to general filelist view
function exitFileAdder() {
	hide('add-dir');
	hide('add-file');
	show('file-library');

	hideSteps([2,3,'f2','f3']);

	// Clear fields
	var fields = document.querySelectorAll('.description-field');
	for (var i = 0; i < fields.length; i++) {
		fields[i].value = '';
	}
	var paths = document.querySelectorAll('.file-path, .dir-path');
	for (var j = 0; j < paths.length; j++) {
		paths[j].innerHTML = '';
	}
	update();
}
$('#back').click(exitFileAdder);
$('#back-dir').click(exitFileAdder;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Add File ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// TODO: Get sliding frame in to work
$('#new-file').click(function() {
	show('add-file');
	hide('file-library');
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Upload ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Upload file option chosen
$('#upload-choice').click(function() {
	hideSteps([2,3]);
	var loadPath = IPCRenderer.sendSync('dialog', 'open', {
		title: 'Upload Path',
		properties: ['openFile'],
	});
	if (loadPath) {
		$('#nickname-file').querySelector('.file-path').innerHTML = loadPath;
		$('#nickname-file-input').value = nameFromPath(loadPath[0]);
		show('nickname-file');
		show('upload-file');
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
	var loadPath = $('#nickname-file').querySelector('.file-path').innerHTML;
	var nickname = $('#nickname-file-input').value;
	upload(loadPath, nickname);
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ .Sia file ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Sia file option chosen
$('#sia-choice').click(function() {
	hideSteps([2,3]);

	var loadPath = IPCRenderer.sendSync('dialog', 'open', {
		title: 'Sia File Path',
		filters: [
			{ name: 'Sia file', extensions: ['sia'] }
		],
		properties: ['openFile'],
	});
	if (loadPath) {
		$('#sia-file').querySelector('.file-path').innerHTML = loadPath;
		show('sia-file');
		show('add-sia-file');
	}
});

// Add .sia file confirmed
$('#add-sia-file').click(function() {
	var loadPath = $('#sia-file').querySelector('.file-path').innerHTML;
	loadDotSia(loadPath);
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ASCII code ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ASCII file option chosen
$('#ascii-choice').click(function() {
	hideSteps([2,3]);

	show('paste-ascii');
	show('add-ascii-file');
	$('#paste-ascii-input').focus();
});

// An 'Enter' keypress in the input field will submit it.
$('#paste-ascii-input').keyup(function(e) {
    e = e || window.event;
    if (e.keyCode === 13) {
        $('#add-ascii-file').click();
    }
});

// Add file from ascii
$('#add-ascii-file').click(function() {
	loadAscii($('#paste-ascii-input').value);
});

// Share ASCII popup
$('#copy-ascii').click(function() {
	var file = $('#show-ascii').querySelector('.ascii').innerHTML;
	var nickname = $('#show-ascii').querySelector('.title').innerHTML;
	Clipboard.writeText(file);
	notify('Copied ' + nickname + '.sia to clipboard!', 'asciifile');
	hide('show-ascii');
});
$('#cancel-ascii').click(function() {
	hide('show-ascii');
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Add directory ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Select directory sliding frame
$('#new-dir').click(function() {
	show('add-dir');
	hide('file-library');
});

// Upload directory option chosen
$('#upload-dir-choice').click(function() {
	hideSteps(['f2','f3']);

	var loadPath = IPCRenderer.sendSync('dialog', 'open', {
		title: 'Select Directory',
		properties: ['openDirectory'],
	});

	// Check that loadPath is a valid path
	if (loadPath) {
		$('#nickname-dir').querySelector('.dir-path').innerHTML = loadPath;
		loadPath = loadPath[0].split(Path.sep);
		$('#nickname-dir-input').value = loadPath[loadPath.length - 1] + '_';
		show('nickname-dir');
		show('upload-dir');
		$('#nickname-dir-input').focus();
	}
});

// Upload directory confirmed
$('#upload-dir').click(function() {
	var loadPath = $('#nickname-dir').querySelector('.dir-path').innerHTML;
	var nickname = $('#nickname-dir-input').value;
	// Illegal filename characters in nickname seems to throw errors
	// So, substitute \ and / with underscore (_)
	nickname.replace(/[/\\\\]/g, '_');
	uploadDir(loadPath, nickname);
});
