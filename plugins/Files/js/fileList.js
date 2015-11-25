'use strict';

// Control data size representation
function formatBytes(bytes, decimals) {
	if (!bytes) {
		return '0B';
	}
	var k = 1000;
	var dm = decimals + 1 || 3;
	var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	var i = Math.floor(Math.log(bytes + 1) / Math.log(k)); // new
	return (bytes / Math.pow(k, i)).toPrecision(dm) + ' ' + sizes[i];
}

// Confirm deletion popup
function confirmDelete(nickname) {
	eID('confirm-delete').querySelector('.nickname').innerHTML = nickname;
	var popup = eID('confirm-delete');
	show(popup);
}

// Make or update file
function updateFile(file) {
	var nick = file.Nickname;

	// if updating or adding
	var adding = eID(nick) ? false : true;

	// Create only new ones
	var fileElement = adding ? eID('filebp').cloneNode(true) : eID(nick);
	fileElement.id = nick;

	// DOM shortcut
	// TODO: Don't know if bad practice because memleak or if it GCs well
	var field = function(selector) {
		return fileElement.querySelector(selector);
	};

	// Set field display values
	field('.name').innerHTML = nick.length < 30 ? nick : nick.substr(0, 27) + '...';
	field('.size').innerHTML = formatBytes(file.Filesize, 2);
	if (file.UploadProgress === 0) {
		field('.time').innerHTML = 'Processing...';
	} else if (file.UploadProgress < 100) {
		field('.time').innerHTML = file.UploadProgress.toFixed(0) + '%';
	} else {
		field('.time').innerHTML = file.TimeRemaining + ' blocks left';
	}

	// Set graphic
	field('.graphic i').classList.add('fa-file');

	// Set availability graphic
	if (file.Available) {
		show(field('.yes'));
		hide(field('.no'));
	} else {
		hide(field('.yes'));
		show(field('.no'));
	}

	// Display file and add listeners if this was new
	if (adding) {
		eID('file-browser').appendChild(fileElement);
		show(fileElement);
	
		// Give the file buttons clickability
		field('.download').onclick = function() {
			download(nick);
		};
		field('.share').onclick = function() {
			share(nick);
		};
		field('.delete').onclick = function() {
			confirmDelete(nick);
		};
	}
}

// Filter file list by search string
function filterFileList(searchstr) {
	NodeList.prototype.forEach = Array.prototype.forEach;
	var entries = eID('file-browser').childNodes;
	entries.forEach( function(entry) {
		if (entry.querySelector('.name').innerHTML.indexOf(searchstr) > -1) {
			show(entry);
		} else {
			hide(entry);
		}
	});
}

// Start search when typing in Search field
eID('search-bar').onkeyup = function() {
	tooltip('Searching...', this);
	var searchstr = eID('search-bar').value;
	filterFileList(searchstr);
};

