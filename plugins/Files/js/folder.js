'use strict';

// Inherits from entity
const entity = require('./entity');
// Siad wrapper/manager
const Siad = require('sia.js');

/*
 * folder:
 *   folder is an object literal that inherits from entity by instantiating one
 *   and assigning more specific members on top of it. It's meant to point to
 *   files, aide file browsing, and facilitate recursive file operations.
 */

let folder = Object.assign(Object.create(entity), {
	type: 'folder',
	contents: {},
	// Changes folder's nickname with Siad call
	setPath (newPath, cb) {
		// Perform all async delete operations in parallel
		var names = Object.keys(contents);
		var count = names.length;
		names.forEach(function(name) {
			contents[name].setPath(`${newPath}/${name}`, function() {
				// Execute the callback iff all operations succeed
				count--;
				if (count === 0 && cb) {
					this.path = newPath;
					cb();
				}
			});
		});
		// Called only if there were no contents
		if (count === 0 && cb) {
			this.path = newPath;
			cb();
		}
	},
	// The below are just function forms of the renter calls a function can
	// enact on itself, see the API.md
	// https://github.com/NebulousLabs/Sia/blob/master/doc/API.md#renter
	delete (cb) {
		// Perform all async delete operations in parallel
		var names = Object.keys(contents);
		var count = names.length;
		names.forEach(function(name) {
			contents[name].delete(function() {
				// Execute the callback iff all operations succeed
				count--;
				if (count === 0 && cb) {
					cb();
				}
			});
		});
		// Called only if there were no contents
		if (count === 0 && cb) {
			cb();
		}
	},
	download (destination, cb) {
		// Perform all async delete operations in parallel
		var names = Object.keys(contents);
		var count = names.length;
		names.forEach(function(name) {
			contents[name].download(`${destination}/${this.name}/${name}`, function() {
				// Execute the callback iff all operations succeed
				count--;
				if (count === 0 && cb) {
					cb();
				}
			});
		});
		// Called only if there were no contents
		if (count === 0 && cb) {
			cb();
		}
	},
	share (filepath, cb) {
		// Perform all async delete operations in parallel
		var names = Object.keys(contents);
		var count = names.length;
		names.forEach(function(name) {
			contents[name].share(`${destination}/${this.name}/${name}`, function() {
				// Execute the callback iff all operations succeed
				count--;
				if (count === 0 && cb) {
					cb();
				}
			});
		});
	},
});

// Factory to create instances of the file object
function folderFactory(arg) {
	// Folders can be constructed from a full path/nickname and 
	let f = Object.create(folder);
	if (typeof arg === 'object'){
		Object.assign(f, arg);
		f.fullName = arg.Nickname;
	} else if (typeof arg === 'string') {
		f.fullName = arg;
	}
	return f;
}

module.exports = folderFactory;
