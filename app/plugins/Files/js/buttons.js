'use strict';

// TODO: Get sliding frame in to work
eID('new-file').onclick = function() {
	eID('add-file').classList.remove('closed');
};
eID('back').onclick = function() {
	eID('add-file').classList.add('closed');
};
eID('step1-upload').onclick = function() {
	var loadPath = IPC.sendSync('dialog', 'open', {
		title: 'Upload Path',
		properties: ['openFile'],
	});
	if (loadPath) {
		eID('step2-nickname').classList.remove('closed');
	}
};
eID('step1-sia').onclick = function() {
	var loadPath = IPC.sendSync('dialog', 'open', {
		title: 'Upload Path',
		filters: [
			{ name: 'Sia file', extensions: ['sia'] }
		],
		properties: ['openFile'],
	});
	if (loadPath) {
		eID('step2-nickname').classList.remove('closed');
	}
};
eID('step1-ascii').onclick = function() {

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
