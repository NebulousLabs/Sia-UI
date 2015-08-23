'use strict';

// TODO: Oust jquery, import in index.html, make it work
eID('upload-file').onclick = function(e) {
	ui.switchView("upload-file");
});
eID('search-bar').keydown(function(e) {
	if (e.keyCode == 13) {
		e.preventDefault();
	}
	updateFileList(lastLoadedFiles);
});
eID('search').onclick = function(e) {
	eSearch.focus();
	updateFileList(lastLoadedFiles);
});
eID('add-ascii').onclick = function(e) {
	ui.switchView("add-ascii");
});

