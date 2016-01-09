'use strict';

/*
 * folder factory module:
 *   folderFactory, when called, makes a new folder object folder is an object
 *   literal that inherits from file by instantiating one and assigning more
 *   specific members on top of it. It's meant to point to files, aide file
 *   browsing, and facilitate recursive file operations.
 */

// Folder object to make copy instances of
const folder = require('./folder');

// Factory to create instances of the file object
function folderFactory(arg) {
	// Folders can be constructed from a '/' deliminated string, representing
	// their path with their name included as the last segment
	var f = Object.create(folder);
	if (typeof arg === 'string') {
		f.path = arg;
	} else {
		console.error('Unrecognized constructur argument: ', arguments);
	}

	return f;
}

module.exports = folderFactory;
