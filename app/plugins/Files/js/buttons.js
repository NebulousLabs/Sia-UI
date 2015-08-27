'use strict';

// TODO: Get sliding frame in to work
eID('new-file').onclick = function() {
	show('add-file');
};
eID('back').onclick = function() {
	hide('add-file');
};

// Used to hide subsequent steps when selecting and earlier one
function hideSteps(number) {
	eID('step' + number).children.forEach(function(next) {
		if(!hidden(next) {
			hide(next);
		}
	});
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
		loadDotSia(loadPath);
	}
};
// Ascii file option chosen
eID('ascii-choice').onclick = function() {
	hideSteps(2);
	hideSteps(3);

	show('paste-ascii');
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
// TODO: Add button responses for add-file frame
