'use strict';

/*
 * folder class module:
 *   folder is an object literal that inherits from file by instantiating one
 *   and assigning more specific members on top of it. It's meant to point to
 *   files, aide file browsing, and facilitate recursive file operations.
 */

// Node modules
const siad = require('sia.js');
const mkdirp = require('mkdirp');
const file = require('./file');
const fileFactory = require('./fileFactory');
const tools = require('./uiTools');

var folder = Object.assign(Object.create(file), {
	type: 'folder',
	contents: {},

	// Changes folder's and its contents' paths with siad call
	setPath (newPath, callback) {
		var names = this.contentsNames;

		// Make array of each content's setPath function
		var functs = names.map(key => this.contents[key].setPath);

		// Make array of new paths per folder's content, ensuring that no name
		// starts with '/' if newPath is '' for the rootFolder
		var paths = newPath !== '' ? names.map(name => `${newPath}/${name}`) : names;

		// Call callback only if all operations succeed
		tools.waterfall(functs, paths, () => {
			this.path = newPath;
			callback();
		});
	},

	// Add a file
	addFile (fileObject) {
		// TODO: verify that the fileObject belongs in this folder
		var f = fileFactory(fileObject);
		this.contents[f.name] = f;
		f.parentFolder = this;
		return f;
	},

	// Add a folder, defined after folderFactory() to use it without breaking
	// strict convention
	addFolder (name) {
		// Copy this folder and erase its state to 'create' a new folder
		// TODO: This seems like an imperfect way to add a new Folder. Can't
		// use folderFactory function down below because using the folder
		// factory again seems to return the same folder. Example:
		//   rootFolder.addFolder('foo') returns a rootFolder with a path of
		//   'foo' but all the same contents, resulting in circular pointers
		//   Thus rootFolder.contents === rootFolder.contents.foo.contents
		var f = Object.create(this);
		f.path = this.path !== '' ? `${this.path}/${name}` : name;
		f.contents = {};
		f.selected = false;
	
		// Link new folder to this one and vice versa
		f.parentFolder = this;
		this.contents[name] = f;
		return f;
	},

	// Return if it's an empty folder
	isEmpty () {
		return this.contentsNames.length === 0;
	},

	// The below are just function forms of the renter calls a function can
	// enact on itself, see the API.md
	// https://github.com/NebulousLabs/Sia/blob/master/doc/API.md#renter
	
	// Recursively delete folder and its contents
	delete (callback) {
		// Make array of each content's delete function
		var functs = this.contentsArray.map(content => content.delete);

		// Call callback only if all operations succeed
		tools.waterfall(functs, () => {
			// Delete parent folder's reference to this folder
			delete this.parentFolder.contents[this.name];
			callback();
		});
	},

	// Download files in folder at destination with same structure
	download (destination, callback) {
		var names = this.contentsNames;

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
		var names = this.contentNames;

		// Make folder at destination
		mkdirp.sync(destination);

		// Make array of each content's share function
		var functs = names.map(key => this.contents[key].share);

		// Make corresponding array of file paths
		names = names.map(name => `${destination}/${name}`);

		// Call callback iff all operations succeed
		tools.waterfall(functs, names, callback);
	},
});

// TODO: How to place a getter in the object definition without it being
// evaluated and misconstrued upon Object.assign?
// Return the names of the contents
Object.defineProperty(folder, 'contentsNames', {
	get: function () {
		return Object.keys(this.contents);
	},
});

// Return the files object as an array instead
Object.defineProperty(folder, 'contentsArray', {
	get: function () {
		return this.contentsNames.map(name => this.contents[name]);
	},
});

// Calculate sum of file sizes
Object.defineProperty(folder, 'size', {
	get: function () {
		var sum = 0;
		this.contentsArray.forEach(content => {
			sum += content.size;
		});
		return sum;
	},
});

// Count the number of files
Object.defineProperty(folder, 'count', {
	get: function () {
		var sum = 0;
		this.contentsArray.forEach(content => {
			sum += content.count;
		});
		return sum;
	},
});

module.exports = folder;
