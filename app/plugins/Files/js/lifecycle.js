'use strict';

// Keeps track of currently existing files
var files = {};

// Make or update file
function updateFile(file) {
	console.log(file);
	var nick = file.Nickname;
	files[nick] = file;

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
	field('.size').innerHTML = formatBytes(file.Filesize);
	if (file.UploadProgress === 0) {
		field('.time').innerHTML = 'Processing...';
	} else if (file.UploadProgress < 100) {
		field('.time').innerHTML = file.UploadProgress.toFixed(2) + '%';
	} else {
		field('.time').innerHTML = file.TimeRemaining + ' Blocks Remaining';
	}

	// Set repairing graphic
	if (file.Repairing) {
		field('.graphic i').classList.remove('fa-file');
		field('.graphic i').classList.add('fa-wrench');
	} else {
		field('.graphic i').classList.remove('fa-wrench');
		field('.graphic i').classList.add('fa-file');
	}

	// Set availability graphic
	// TODO: Does this and the Repairing graphic have to be separate? 
	// Would a file ever be available while it is being repaired?
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
			deleteFile(nick);
		};
	}
}

// Regularly update the file library and status
function update() {
	IPC.sendToHost('api-call', '/renter/files/list', 'update-list');
	IPC.sendToHost('api-call', '/renter/status', 'update-status');
	
	updating = setTimeout(update, 15000);
}

// On receiving api call result for file list
addResultListener('update-list', function(result) {
	result.forEach(updateFile);
});

// Update capsule values with renter status
addResultListener('update-status', function(result) {
	var priceDisplay = convertSiacoin(result.Price).toFixed(3) + ' S Per GB (Estimated)';
	eID('price').innerHTML = priceDisplay;

	var hostsDisplay = result.KnownHosts + ' Known Hosts';
	eID('host-count').innerHTML = hostsDisplay;
});

// Called upon showing
function start() {
	// DEVTOOL: uncomment to bring up devtools on plugin view
	// IPC.sendToHost('devtools');
	
	// Call the API
	update();
}

// Called upon transitioning away from this view
function stop() {
	// Stop updating
	clearTimeout(updating);
}

