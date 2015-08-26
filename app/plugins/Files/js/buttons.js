'use strict';

// TODO: Oust jquery, import in index.html, make it work
eID('new-file').onclick = function(e) {
	// TODO: Slide in add-file frame
	eID('add-file').classList.remove('closed');
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
