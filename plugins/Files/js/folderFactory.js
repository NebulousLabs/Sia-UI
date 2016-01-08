'use strict';

/*
 * folder factory module:
 *   folderFactory, when called, makes a new folder object
 *   folder is an object literal that inherits from entity by instantiating one
 *   and assigning more specific members on top of it. It's meant to point to
 *   files, aide file browsing, and facilitate recursive file operations.
 */

// Folder object to make copy instances of
const folder = require('./folder');

// TODO: How to place a getter in the object definition without it being
// evaluated and misconstrued upon Object.assign?
function addGetters(f) {
	// Return the names of the contents
	Object.defineProperty(f, 'contentsNames', {
		get: function () {
			return Object.keys(this.contents);
		},
	});

	// Return the files object as an array instead
	Object.defineProperty(f, 'contentsArray', {
		get: function () {
			return this.contentsNames.map(name => this.contents[name]);
		},
	});

	// Calculate sum of file sizes
	Object.defineProperty(f, 'size', {
		get: function () {
			var sum = 0;
			this.contentsArray.forEach(content => {
				sum += content.size;
			});
			return sum;
		},
	});
}

// Factory to create instances of the file object
function folderFactory(arg) {
	// Folders can be constructed from a '/' deliminated string, representing
	// their path with their name included as the last segment
	var f = Object.create(folder);
	addGetters(f);
	if (typeof arg === 'string') {
		f.path = arg;
	} else {
		console.error('Unrecognized constructur argument: ', arguments);
	}

	return f;
}

module.exports = folderFactory;
