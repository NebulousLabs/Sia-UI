'use strict';

function download(nickname) {
	var savePath = IPCRenderer.sendSync('dialog', 'save', {
		defaultPath: nickname,
	});
	if (!savePath) {
		return;
	}
	notify('Downloading ' + nickname + ' to '+ savePath +' folder', 'download');
	Siad.apiCall({
		url: '/renter/files/download',
		qs: {
			nickname: nickname,
			destination: savePath,
		},
	}, update);
}

function share(nickname) {
	// Set popup title
	eID('show-ascii').querySelector('.title').innerHTML = nickname;

	// Make a request to get the ascii share string
	Siad.apiCall({
		url: '/renter/files/shareascii',
		qs: {
			nickname: nickname,
		}
	}, function(result) {
		var popup = eID('show-ascii');
		show(popup);
	
		popup.querySelector('.ascii').innerHTML = result.File;
	
		update();
	});
}

function upload(filePath, nickname) {
	notify('Uploading ' + nickname + ' to Sia Network', 'upload');
	Siad.apiCall({
		url: '/renter/files/upload',
		qs: {
			source: filePath,
			nickname: nickname,
		},
	}, exitFileAdder);
}

function loadDotSia(filePath) {
	notify('Adding ' + nameFromPath(filePath) + ' to library', 'siafile');
	Siad.apiCall({
		url: '/renter/files/load',
		qs: {
			filename: filePath,
		}
	}, exitFileAdder);
}

// Checks whether a path starts with or contains a hidden file or a folder.
function isUnixHiddenPath(path) {
	return (/(^|\/)\.[^\/\.]/g).test(path);
}

// Non-recursively upload all files in a directory
function uploadDir(dirPath, nickname) {
	// Upload files one at a time
	Fs.readdir(dirPath, function(err, files) {
		if (err) {
			notify('Failed retrieving directory contents', 'error');
			return;
		}
		files.forEach( function(file) {
			var filePath = Path.join(dirPath, file);

			// Skip hidden files and directories
			Fs.stat(filePath, function(err, stats) {
				if (err) {
					notify('Cannot read ' + file, 'error');
					return;
				}
				if (!isUnixHiddenPath(filePath) && stats.isFile()) {
					upload(filePath, nickname + file);
				}
			});
		});
	});
}

function loadAscii(ascii) {
	notify('Adding file(s) to library', 'asciifile');
	Siad.apiCall({
		url: '/renter/files/loadascii',
		qs: {
			file: ascii,
		}
	}, exitFileAdder);
}

function deleteFile(nickname) {
	// Make the request to delete the file.
	Siad.apiCall({
		url: '/renter/files/delete',
		qs: {
			nickname: nickname,
		}
	}, update);
}

