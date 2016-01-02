'use strict';

/*
 * folder factory module:
 *   folder is an object literal that inherits from entity by instantiating one
 *   and assigning more specific members on top of it. It's meant to point to
 *   files, aide file browsing, and facilitate recursive file operations.
 */

// Inherits from entity
const entity = require('./entity');
// Contains files and folders
const file = require('./file');
// siad wrapper/manager
const siad = require('sia.js');
// For making file system directories
const mkdirp = require('mkdirp');

var folder = {
	type: 'folder',
	contents: {},
	// Changes folder's nickname with siad call
	setPath (newPath, callback) {
		// Perform all async delete operations in parallel
		var names = Object.keys(this.contents);
		var count = names.length;
		var self = this;

		// Recursively rename
		names.forEach(function(name) {
			self.contents[name].setPath(`${newPath}/${name}`, function() {
				// Execute the callback iff all operations succeed
				if (--count === 0 && callback) {
					self.path = newPath;
					callback();
				}
			});
		});

		// Called iff no contents
		if (this.isEmpty() && callback) {
			this.path = newPath;
			callback();
		}
	},
	// Calculate sum of file sizes
	size () {
		var sum = 0;
		var self = this;
		Object.keys(this.contents).forEach(function(name) {
			sum += self.contents[name].size();
		});
		return sum;
	},
	// Add a file
	addFile (fileObject) {
		// TODO: verify that the fileObject belongs in this folder
		var f = file(fileObject);
		this.contents[f.name] = f;
		f.parentFolder = this;
		return f;
	},
	// Add a folder
	addFolder (name) {
		// Prefer paths of 'foo' over '/foo' in root folder
		var path = this.path === '' ? name : `${this.path}/${name}`;

		// Copy this folder and erase its info to create a new folder
		// TODO: This seems like an imperfect way to add a new Folder. Can't
		// use folderFactory function down below because of convention/linting
		// rules.
		var f = Object.create(this);
		f.path = path;
		f.contents = {};

		// Link new folder to this one and vice versa
		f.parentFolder = this;
		this.contents[name] = f;
		return f;
	},
	// Return if it's an empty folder
	isEmpty () {
		return Object.keys(this.contents).length === 0;
	},
	// The below are just function forms of the renter calls a function can
	// enact on itself, see the API.md
	// https://github.com/NebulousLabs/Sia/blob/master/doc/API.md#renter
	delete (callback) {
		var self = this;
		// Perform all async delete operations in parallel
		var names = Object.keys(this.contents);
		var count = names.length;

		// Recursively delete
		names.forEach(function(name) {
			self.contents[name].delete(function() {
				delete self.contents[name];
				// Execute the callback iff all operations succeed
				if (--count === 0 && callback) {
					callback();
				}
			});
		});

		// Called iff no contents
		if (this.isEmpty() && callback) {
			callback();
		}
	},
	download (destination, callback) {
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
				if (--count === 0 && callback) {
					callback();
				}
			});
		});

		// Called iff no contents
		if (this.isEmpty() && callback) {
			callback();
		}
	},
	share (filepath, callback) {
		var self = this;
		// Perform all async delete operations in parallel
		var names = Object.keys(this.contents);
		var count = names.length;
		// Make folder at destination
		mkdirp.sync(`${filepath}/${this.name}`);

		// Make .sia files in above folder
		names.forEach(function(name) {
			self.contents[name].share(`${filepath}/${self.name}/${name}`, function() {
				// Execute the callback iff all operations succeed
				if (--count === 0 && callback) {
					callback();
				}
			});
		});

		// Called iff no contents
		if (this.isEmpty() && callback) {
			callback();
		}
	},
};

// Factory to create instances of the file object
function folderFactory(arg) {
	// Folders can be constructed from a '/' deliminated string, representing
	// their path with their name included as the last segment
	var f = Object.assign(Object.create(entity), folder);
	if (typeof arg === 'string') {
		f.path = arg;
	} else {
		console.error('Unrecognized constructur argument: ', arguments);
	}
	return f;
}

module.exports = folderFactory;
