'use strict';

/*
 * folder:
 *   folder is an object literal that inherits from entity by instantiating one
 *   and assigning more specific members on top of it. It's meant to point to
 *   files, aide file browsing, and facilitate recursive file operations.
 */

// Inherits from entity
const entity = require('./entity');
// siad wrapper/manager
const siad = require('sia.js');
// For making file system directories
const mkdirp = require('mkdirp');

var folder = {
	type: 'folder',
	contents: {},
	// Used for debugging purposes, returns 'this' from the
	// object definition POV. Helpful to demystify Object.assign
	// and Object.create
	get self () {
		return this;
	},
	// Changes folder's nickname with siad call
	setPath (newPath, cb) {
		// Perform all async delete operations in parallel
		var names = Object.keys(this.contents);
		var count = names.length;
		var self = this;

		// Recursively rename
		names.forEach(function(name) {
			self.contents[name].setPath(`${newPath}/${name}`, function() {
				// Execute the callback iff all operations succeed
				count--;
				if (count === 0 && cb) {
					self.path = newPath;
					cb();
				}
			});
		});

		// Called iff no contents
		if (this.isEmpty() && cb) {
			this.path = newPath;
			cb();
		}
	},
	// Calculate sum of file sizes
	get size () {
		var sum = 0;
		var self = this;
		Object.keys(this.contents).forEach(function(name) {
			sum += self.contents[name].size;
		});
		return sum;
	},
	// Return if it's an empty folder
	isEmpty () {
		return Object.keys(this.contents).length === 0;
	},
	// The below are just function forms of the renter calls a function can
	// enact on itself, see the API.md
	// https://github.com/NebulousLabs/Sia/blob/master/doc/API.md#renter
	delete (cb) {
		var self = this;
		// Perform all async delete operations in parallel
		var names = Object.keys(this.contents);
		var count = names.length;

		// Recursively delete
		names.forEach(function(name) {
			self.contents[name].delete(function() {
				delete self.contents[name];
				// Execute the callback iff all operations succeed
				count--;
				if (count === 0 && cb) {
					cb();
				}
			});
		});

		// Called iff no contents
		if (this.isEmpty() && cb) {
			cb();
		}
	},
	download (destination, cb) {
		var self = this;
		// Perform all async delete operations in parallel
		var names = Object.keys(this.contents);
		var count = names.length;
		// Make folder at destination
		mkdirp.sync(`${destination}/${this.name}`);

		// Download contents to above folder
		names.forEach(function(name) {
			self.contents[name].download(`${destination}/${self.name}/${name}`, function() {
				// Execute the callback iff all operations succeed
				count--;
				if (count === 0 && cb) {
					cb();
				}
			});
		});

		// Called iff no contents
		if (this.isEmpty() && cb) {
			cb();
		}
	},
	share (filepath, cb) {
		var self = this;
		// Perform all async delete operations in parallel
		var names = Object.keys(this.contents);
		var count = names.length;
		// Make folder at destination
		mkdirp.sync(`${filepath}/${this.name}`);
		// Called iff no contents
		if (this.isEmpty() && cb) {
			this.path = newPath;
			cb();
			return;
		}
		// Make .sia files in above folder
		names.forEach(function(name) {
			self.contents[name].share(`${filepath}/${self.name}/${name}`, function() {
				// Execute the callback iff all operations succeed
				count--;
				if (count === 0 && cb) {
					cb();
				}
			});
		});

		// Called iff no contents
		if (this.isEmpty() && cb) {
			cb();
		}
	},
};

// Factory to create instances of the file object
function folderFactory(arg) {
	// Folders can be constructed from a '/' deliminated string, representing
	// their path with their name included as the last segment
	let f = Object.assign(Object.create(entity), folder);
	if (typeof arg === 'string') {
		f.path = arg;
	} else {
		console.error('Unrecognized constructur argument: ', arguments);
	}
	return f;
}

module.exports = folderFactory;
