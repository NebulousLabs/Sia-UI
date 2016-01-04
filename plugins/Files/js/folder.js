'use strict';

/*
 * folder factory module:
 *   folder is an object literal that inherits from entity by instantiating one
 *   and assigning more specific members on top of it. It's meant to point to
 *   files, aide file browsing, and facilitate recursive file operations.
 */

// Node modules
const siad = require('sia.js');
const mkdirp = require('mkdirp');
const entity = require('./entity');
const file = require('./file');
const tools = require('.//uiTools');

var folder = {
	type: 'folder',
	contents: {},

	// Changes folder's and its contents' paths with siad call
	setPath (newPath, callback) {
		var names = Object.keys(this.contents);

		// Make array of each content's setPath function
		var functs = names.map(key => this.contents[key].setPath);

		// Don't prepend '/' to names if newPath is an empty string
		if (newPath) {
			// Make array of new paths per folder's content
			names = names.map(name => `${newPath}/${name}`);
		}

		// Call callback only if all operations succeed
		tools.waterfall(functs, names, () => {
			this.path = newPath;
			callback();
		});
	},

	// Calculate sum of file sizes
	size () {
		var sum = 0;
		Object.keys(this.contents).forEach(name => {
			sum += this.contents[name].size();
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
	
	// Recursively delete folder and its contents
	delete (callback) {
		// Make array of each content's delete function
		var functs = Object.keys(this.contents).map(key => this.contents[key].delete);

		// Call callback only if all operations succeed
		tools.waterfall(functs, () => {
			// Delete parent folder's reference to this folder
			delete this.parentFolder.contents[this.name];
			callback();
		});
	},

	// Download files in folder at destination with same structure
	download (destination, callback) {
		var names = Object.keys(this.contents);

		// Make folder at destination
		mkdirp.sync(destination);

		// Make array of each content's download function
		var functs = names.map(key => this.contents[key].download);

		// Make corresponding array of destination paths
		names = names.map(name => `${destination}/${name}`);

		// Call callback iff all operations succeed
		tools.waterfall(functs, names, callback);
	},

	// Share .sia files into folder at destination with same structure
	share (destination, callback) {
		var names = Object.keys(this.contents);

		// Make folder at destination
		mkdirp.sync(destination);

		// Make array of each content's share function
		var functs = names.map(key => this.contents[key].share);

		// Make corresponding array of file paths
		names = names.map(name => `${destination}/${name}`);

		// Call callback iff all operations succeed
		tools.waterfall(functs, names, callback);
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
