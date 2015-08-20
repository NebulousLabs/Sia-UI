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
function addFile(file) {
	// Add or update in files object
	files[file.Nickname] = file;

	// Create only new ones
	var fileElement = eID(file.Nickname) ? eID(file.Nickname) : eID('filebp').cloneNode(true);
	fileElement.id = file.Nickname;

	// DOM shortcut
	// TODO: Don't know if bad practice because memleak or if it GCs well
	var field = function(selector) {
		return fileElement.querySelector(selector);
	};

	// Set field display values
	field('.name').innerHTML = file.Nickname.length < 30 ? file.Nickname : file.Nickname.substr(0, 27) + '...';
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
		field('.yes').classList.remove('fa-file');
		field('.yes').classList.add('fa-wrench');
	} else {
		field('.available').classList.remove('fa-wrench');
		field('.available').classList.add('fa-file');
	}


	// Display file
	eID('file-browser').appendChild(f);
	show(fileElement);
}

// Make API calls, sending a channel name to listen for responses
function update() {
	IPC.sendToHost('api-call', '/renter/files/list', 'list');

	// TODO: Hardcoded testing now
	files.forEach(addFile);
	
	updating = setTimeout(update, 15000);
}
addResultListener('list', function(result) {
	result.forEach(addFile);
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

