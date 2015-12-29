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

let folder = Object.assign(Object.create(entity), {
	type: 'folder',
	contents: {},
	// Changes folder's nickname with siad call
	setPath (newPath, cb) {
		// Perform all async delete operations in parallel
		var names = Object.keys(this.contents);
		var count = names.length;
		names.forEach(function(name) {
			this.contents[name].setPath(`${newPath}/${name}`, function() {
				// Execute the callback iff all operations succeed
				count--;
				if (count === 0 && cb) {
					this.path = newPath;
					cb();
				}
			});
		});
		// Called iff there were no contents
		if (count === 0 && cb) {
			this.path = newPath;
			cb();
		}
	},
	// Calculate sum of file sizes
	get size () {
		var sum = 0;
		Object.keys(this.contents).forEach(function(name) {
			sum += this.contents[name].size;
		});
		return sum;
	},
	// The below are just function forms of the renter calls a function can
	// enact on itself, see the API.md
	// https://github.com/NebulousLabs/Sia/blob/master/doc/API.md#renter
	delete (cb) {
		// Perform all async delete operations in parallel
		var names = Object.keys(this.contents);
		var count = names.length;
		names.forEach(function(name) {
			this.contents[name].delete(function() {
				delete this.contents[name];
				// Execute the callback iff all operations succeed
				count--;
				if (count === 0 && cb) {
					// TODO: Can I make this folder delete itself?
					cb();
				}
			});
		});
		// Called iff there were no contents
		if (count === 0 && cb) {
			// TODO: Can I make this folder delete itself?
			cb();
		}
	},
	download (destination, cb) {
		// Perform all async delete operations in parallel
		var names = Object.keys(this.contents);
		var count = names.length;
		// Make folder at destination
		mkdirp.sync(`${destination}/${this.name}`);
		// Download contents to above folder
		names.forEach(function(name) {
			this.contents[name].download(`${destination}/${this.name}/${name}`, function() {
				// Execute the callback iff all operations succeed
				count--;
				if (count === 0 && cb) {
					cb();
				}
			});
		});
		// Called iff there were no contents
		if (count === 0 && cb) {
			cb();
		}
	},
	share (filepath, cb) {
		// Perform all async delete operations in parallel
		var names = Object.keys(this.contents);
		var count = names.length;
		// Make folder at destination
		mkdirp.sync(`${filepath}/${this.name}`);
		// Make .sia files in above folder
		names.forEach(function(name) {
			this.contents[name].share(`${filepath}/${this.name}/${name}`, function() {
				// Execute the callback iff all operations succeed
				count--;
				if (count === 0 && cb) {
					cb();
				}
			});
		});
		// Called iff there were no contents
		if (count === 0 && cb) {
			cb();
		}
	},
});

// Factory to create instances of the file object
function folderFactory(arg) {
	// Folders can be constructed from a '/' deliminated string, representing
	// their path with their name included as the last segment
	let f = Object.create(folder);
	if (typeof arg === 'string') {
		f.path = arg;
	} else {
		console.error('Unrecognized constructur argument: ', arguments);
	}
	return f;
}

module.exports = folderFactory;
