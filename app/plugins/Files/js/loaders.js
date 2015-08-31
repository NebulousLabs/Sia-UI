'use strict';

// TODO: Can a webview use IPC.sendSync?
function download(nickname) {
	// TODO: setup dialog system
	var savePath = IPC.sendSync('dialog', 'save', {
		defaultPath: nickname,
	});
	if (!savePath) {
		return;
	}
	notify('Downloading ' + nickname + ' to '+ savePath +' folder', 'download');
	IPC.sendToHost('api-call', {
		url: '/renter/files/download',
		type: 'GET',
		args: {
			nickname: nickname,
			destination: savePath,
		},
	}, 'downloaded');
}
addResultListener('downloaded', function(result) {
	update();
});

function share(nickname) {
	// Make a request to get the ascii share string
	IPC.sendToHost('api-call', {
		url: '/renter/files/shareascii',
		args: {
			nickname: nickname,
		}
	}, 'shared');
	// Set popup title
	eID('show-ascii').querySelector('.title').innerHTML = nickname;
}
addResultListener('shared', function(result) {
	var popup = eID('show-ascii');
	show(popup);

	popup.querySelector('.ascii').innerHTML = result.File;

	update();
});

function upload(filePath, nickname) {
	IPC.sendToHost('api-call', {
		url: '/renter/files/upload',
		type: 'GET',
		args: {
			source: filePath,
			nickname: nickname,
		},
	}, 'uploaded');
	notify('Uploading ' + nickname + ' to Sia Network', 'upload');
}
addResultListener('uploaded', function(result) {
	exitFileAdder();
	update();
});

function loadDotSia(filePath) {
	IPC.sendToHost('api-call', {
		url: '/renter/files/load',
		args: {
			filename: filePath,
		}
	}, 'file-loaded');
	notify('Adding ' + nameFromPath(filePath) + ' to library', 'siafile');
}
addResultListener('file-loaded', function(result) {
	exitFileAdder();
	update();
});

function loadAscii(ascii) {
	IPC.sendToHost('api-call', {
		url: '/renter/files/loadascii',
		args: {
			file: ascii,
		}
	}, 'ascii-loaded');
	notify('Adding file(s) to library', 'asciifile');
}
addResultListener('ascii-loaded', function(result) {
	exitFileAdder();
	update();
});

function deleteFile(nickname) {
	// Make the request to delete the file.
	IPC.sendToHost('api-call', {
		url: '/renter/files/delete',
		args: {
			nickname: nickname,
		}
	}, 'deleted');
}
addResultListener('deleted', function(result) {
	update();
});

