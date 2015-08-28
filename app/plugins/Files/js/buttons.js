'use strict';

// TODO: Get sliding frame in to work
function hideFileAdder() {
	hide('add-file');
	show('file-library');
};

eID('new-file').onclick = function() {
	show('add-file');
	hide('file-library');
};
eID('back').onclick = hideFileAdder;

// Used to hide subsequent steps when selecting and earlier one
function hideSteps(number) {
	var c = eID('step' + number).children;
	for (var i = 0; i < c.length; i++) {
		if(!hidden(c[i])) {
			hide(c[i]);
		}
	};
}

// Upload file option chosen
eID('upload-choice').onclick = function() {
	hideSteps(2);
	hideSteps(3);

	var loadPath = IPC.sendSync('dialog', 'open', {
		title: 'Upload Path',
		properties: ['openFile'],
	});
	if (loadPath) {
		show('nickname-file');
		show('upload-file');
	}
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
		show('sia-file');
		show('add-sia-file');
	}
};
// Ascii file option chosen
eID('ascii-choice').onclick = function() {
	hideSteps(2);
	hideSteps(3);

	show('paste-ascii');
	show('add-ascii-file');
};
/*
eID('search-bar').keydown(function(e) {
	// TODO: figure out search bar to work on enter key
	updateFileList(lastLoadedFiles);
};
eID('search').onclick = function(e) {
	// TODO: figure out search bar to work on enter key
	updateFileList(lastLoadedFiles);
};
*/
