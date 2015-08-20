'use strict';

// Keeps track of currently existing files
// TODO: for now, hardcoding a file list
var files = {
	Test1: {
		Available: true,
		Nickname: Test1,
		Repairing: false,
		TimeRemaining: 10000,
	},
	Test2: {
		Available: true,
		Nickname: Test2,
		Repairing: false,
		TimeRemaining: 10000,
	},
	Test3: {
		Available: true,
		Nickname: Test3,
		Repairing: false,
		TimeRemaining: 10000,
	},
	Test4: {
		Available: true,
		Nickname: Test4,
		Repairing: false,
		TimeRemaining: 10000,
	},
	Test5: {
		Available: true,
		Nickname: Test5,
		Repairing: false,
		TimeRemaining: 10000,
	},
};

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
