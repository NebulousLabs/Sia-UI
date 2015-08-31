'use strict';

// Library for working with clipboard
const Clipboard = require('clipboard');

// Used to hide subsequent steps when selecting and earlier one
function hideSteps(number) {
	var c = eID('step' + number).children;
	for (var i = 0; i < c.length; i++) {
		if(!hidden(c[i])) {
			hide(c[i]);
		}
	}
}

// Exit function to return to general filelist view
function exitFileAdder() {
	hide('add-file');
	show('file-library');

	hideSteps(2);
	hideSteps(3);

	// Clear fields
	var fields = document.querySelectorAll('.description-field');
	for (var i = 0; i < fields.length; i++) {
		fields[i].value = '';
	}
	var paths = document.querySelectorAll('.file-path');
	for (var j = 0; j < paths.length; j++) {
		paths[j].innerHTML = '';
	}
}

// TODO: Get sliding frame in to work
eID('new-file').onclick = function() {
	show('add-file');
	hide('file-library');
};
eID('back').onclick = exitFileAdder;

// Upload file option chosen
eID('upload-choice').onclick = function() {
	hideSteps(2);
	hideSteps(3);

	var loadPath = IPC.sendSync('dialog', 'open', {
		title: 'Upload Path',
		properties: ['openFile'],
	});
	if (loadPath) {
		eID('nickname-file').querySelector('.file-path').innerHTML = loadPath;
		eID('nickname-file-input').value = nameFromPath(loadPath[0]);
		show('nickname-file');
		show('upload-file');
		// TODO: this does not work for some reason. Perhaps the view needs to
		// be refocused after the dialog box is closed.
		eID('nickname-file-input').focus();
	}
};
eID('nickname-file-input').addEventListener("keydown", function(e) {
    e = e || window.event;
    if (e.keyCode == 13) {
        eID('upload-file').click();
    }
}, false);
eID('upload-file').onclick = function() {
	var loadPath = eID('nickname-file').querySelector('.file-path').innerHTML;
	var nickname = eID('nickname-file-input').value;
	upload(loadPath, nickname);
	eID('nickname-file-input').focus();
};

// Sia file option chosen
eID('sia-choice').onclick = function() {
	hideSteps(2);
	hideSteps(3);

	var loadPath = IPC.sendSync('dialog', 'open', {
		title: 'Sia File Path',
		filters: [
			{ name: 'Sia file', extensions: ['sia'] }
		],
		properties: ['openFile'],
	});
	if (loadPath) {
		eID('sia-file').querySelector('.file-path').innerHTML = loadPath;
		show('sia-file');
		show('add-sia-file');
	}
};
eID('add-sia-file').onclick = function() {
	var loadPath = eID('sia-file').querySelector('.file-path').innerHTML;
	loadDotSia(loadPath);
};

// ASCII file option chosen
eID('ascii-choice').onclick = function() {
	hideSteps(2);
	hideSteps(3);

	show('paste-ascii');
	show('add-ascii-file');
	eID('paste-ascii-input').focus();
};
eID('paste-ascii-input').addEventListener("keydown", function(e) {
    e = e || window.event;
    if (e.keyCode == 13) {
        eID('add-ascii-file').click();
    }
}, false);
eID('add-ascii-file').onclick = function() {
	loadAscii(eID('paste-ascii-input').value);
};

// Share ASCII popup
eID('copy-ascii').onclick = function() {
	var file = eID('show-ascii').querySelector('.ascii').innerHTML;
	var nickname = eID('show-ascii').querySelector('.title').innerHTML;
	Clipboard.writeText(file);
	notify('Copied ' + nickname + '.sia to clipboard!', 'asciifile');
	hide('show-ascii');
};
eID('cancel-ascii').onclick = function() {
	hide('show-ascii');
};

/*
eID('search-bar').keydown(function(e) {
	// TODO: figure out search bar
	updateFileList(lastLoadedFiles);
};
eID('search').onclick = function(e) {
	// TODO: figure out search bar
	updateFileList(lastLoadedFiles);
};
*/
