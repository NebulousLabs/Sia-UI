function download(nickname) {
	// TODO: setup dialog system
	var savePath = IPC.sendToHost('dialog', 'save', nickname);
	if (!savePath) {
		return
	}
	notify('Downloading ' + nickname + ' to '+ savePath +' folder', 'download');
	IPC.sendToHost('api-call', {
		url: '/renter/files/download',
		type: 'GET',
		args: {
			nickname: nickname,
			destination: savePath
		},
	}, 'downloaded');
};
addResultListener('downloaded', function(response) {
});

function upload(filePath, nickname) {
	notify('Uploading ' + nickname + ' to Sia Network', 'upload');
	IPC.sendToHost('api-call', {
		url: '/renter/files/upload',
		type: 'GET',
		args: {
			source: filePath,
			nickname: nickname,
		},
	}, 'uploaded');
};
addResultListener('uploaded', function(response) {
});

function share(nickname) {
	// Make a request to get the ascii share string
	IPC.sendToHost('api-call', {
		url: '/renter/files/shareascii',
		args: {
			nickname: nickname,
		}
	}, 'shared');
};
addResultListener('shared', function(response) {
});

function addascii(asciiText) {
	IPC.sendToHost('api-call', {
		url: '/renter/files/loadascii',
		args: {
			file: asciiText
		}
	}, 'ascii-added');
};
addResultListener('ascii-added', function(response) {
});

function deleteFile(nickname) {
	// Make the request to delete the file.
	IPC.sendToHost('api-call', {
		url: '/renter/files/delete',
		args: {
			nickname: nickname
		}
	}, 'deleted');
};
addResultListener('deleted', function(response) {
});

