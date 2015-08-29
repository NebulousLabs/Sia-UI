'use strict';

// TODO: Get sliding frame in to work
eID('new-file').onclick = function() {
	show('add-file');
	hide('file-library');
};
eID('back').onclick = exitFileAdder;

// Exit function to return to general filelist view
function exitFileAdder() {
	hide('add-file');
	show('file-library');

	// Clear fields
	var fields = document.querySelectorAll('.description-field');
	for (var i = 0; i < fields.length; i++) {
		fields[i].value = '';
	}
	var paths = document.querySelectorAll('.file-path');
	for (var i = 0; i < paths.length; i++) {
		paths[i].innerHTML = '';
	}
}

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
		eID('nickname-file').querySelector('.file-path').innerHTML = loadPath;
		eID('nickname-file').querySelector('.description-field').value = nameFromPath(loadPath[0]);
		show('nickname-file');
		show('upload-file');
	}
};
eID('upload-file').onclick = function() {
	var loadPath = eID('nickname-file').querySelector('.file-path').innerHTML;
	var nickname = eID('nickname-file').querySelector('.description-field').value;
	console.log(loadPath);
	upload(loadPath, nickname);
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

// Ascii file option chosen
eID('ascii-choice').onclick = function() {
	hideSteps(2);
	hideSteps(3);

	show('paste-ascii');
	show('add-ascii-file');
};
eID('add-ascii-file').onclick = function() {
	var ascii = eID('paste-ascii').querySelector('.description-field').value;
	loadAscii(ascii);
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
