'use strict';

// Keeps track of currently existing files
var files = {};
// TODO: for now, hardcoding a file list
var testfiles = [
	{
		Available: true,
		Nickname: 'Test1',
		Repairing: false,
		TimeRemaining: 10000,
	}, {
		Available: true,
		Nickname: 'Test2',
		Repairing: false,
		TimeRemaining: 10000,
	}, {
		Available: true,
		Nickname: 'Test3',
		Repairing: false,
		TimeRemaining: 10000,
	}, {
		Available: true,
		Nickname: 'Test4',
		Repairing: false,
		TimeRemaining: 10000,
	}, {
		Available: true,
		Nickname: 'Test5',
		Repairing: false,
		TimeRemaining: 10000,
	}
];

// Make file from blueprint
function updateFile(file) {
	console.log(file);
	var nick = file.Nickname;
	// Add or update in files object
	files[nick] = file;

	// Create only new ones
	var fileElement = eID(nick) ? eID(nick) : eID('filebp').cloneNode(true);
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

	// Display file
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

// Make API calls, sending a channel name to listen for responses
function update() {
	updateFileList();

	// TODO: Hardcoded testing now
	testfiles.forEach(updateFile);
	
	updating = setTimeout(update, 15000);
}

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

