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
const fileClass = require('./file');
const fileFactory = require('./fileFactory');
const tools = require('./uiTools');

var folder = Object.assign(Object.create(fileClass), {
	type: 'folder',
	files: {},

	// The below are just function forms of the renter calls a function can
	// enact on itself, see the API.md
	// https://github.com/NebulousLabs/Sia/blob/master/doc/API.md#renter

	// Changes folder's and its files' paths with siad call
	// TODO: Verify if works
	setPath (newPath, callback) {
		if (tools.notType(newPath, 'string')) {
			return;
		}
		var names = this.fileNames;

		// Make array of each file's setPath function
		var functs = names.map(key => this.files[key].setPath);

		// Make array of new paths per folder's file, ensuring that no name
		// starts with '/' if newPath is '' for the rootFolder
		var paths = newPath !== '' ? names.map(name => `${newPath}/${name}`) : names;

		// Call callback only if all operations succeed
		tools.waterfall(functs, paths, () => {
			this.path = newPath;
			callback();
		});
	},

	// Recursively delete folder and its files
	delete (callback) {
		// Make array of each file's delete function
		var functs = this.filesArray.map(file => file.delete);

		// Call callback only if all operations succeed
		tools.waterfall(functs, () => {
			// Delete parent folder's reference to this folder
			delete this.parentFolder.files[this.name];
			callback();
		});
	},

	// Download files in folder at destination with same structure
	download (destination, callback) {
		if (tools.notType(destination, 'string')) {
			return;
		}
		var names = this.fileNames;

		// Make folder at destination
		mkdirp.sync(destination);

		// Make array of each file's download function
		var functs = names.map(key => this.files[key].download);

		// Make corresponding array of destination paths
		names = names.map(name => `${destination}/${name}`);

		// Call callback iff all operations succeed
		tools.waterfall(functs, names, callback);
	},

	// Share .sia files of all files (deep) to destination
	share (destination, callback) {
		if (tools.notType(destination, 'string')) {
			return;
		} else if (destination.slice(-4) !== '.sia') {
			console.error('Share path needs end in ".sia"!', destination);
			return;
		}
		siad.apiCall({
			url: '/renter/share',
			qs: {
				siapaths: this.paths,
				destination: destination,
			},
		}, callback);
	},

	// Share ascii of all files (deep)
	shareascii (callback) {
		siad.apiCall({
			url: '/renter/shareascii',
			qs: {
				siapaths: this.paths,
			},
		}, callback);
	},

	// Misc. functions
	// Add a file
	// TODO: Verify if works
	addFile (fileObject) {
		if (tools.notType(fileObject, 'object')) {
			return;
		}
		// TODO: verify that the fileObject belongs in this folder
		var f = fileFactory(fileObject);
		this.files[f.name] = f;
		f.parentFolder = this;
		return f;
	},

	// Add a folder, defined after folderFactory() to use it without breaking
	// strict convention
	addFolder (name) {
		if (tools.notType(name, 'string')) {
			return;
		}
		// Copy this folder and erase its state to 'create' a new folder
		// TODO: This seems like an imperfect way to add a new Folder. Can't
		// use folderFactory function down below because using the folder
		// factory again seems to return the same folder. Example:
		//   rootFolder.addFolder('foo') returns a rootFolder with a path of
		//   'foo' but all the same files, resulting in circular pointers
		//   Thus rootFolder.files === rootFolder.files.foo.files
		var f = Object.create(this);
		f.path = this.path !== '' ? `${this.path}/${name}` : name;
		f.files = {};
	
		// Link new folder to this one and vice versa
		f.parentFolder = this;
		this.files[name] = f;
		return f;
	},

	// Return if it's an empty folder
	isEmpty () {
		return this.fileNames.length === 0;
	},

});

// TODO: How to place a getter in the object definition without it being
// evaluated and misconstrued upon Object.assign?
function addGetter(name, getter) {
	Object.defineProperty(folder, name, {
		get: getter,
	});
}

// Return the names of the files
Object.defineProperty(folder, 'fileNames', {
	get: function () {
		return Object.keys(this.files);
	},
});

// Return the files object as an array instead
Object.defineProperty(folder, 'filesArray', {
	get: function () {
		return this.fileNames.map(name => this.files[name]);
	},
});

var typeError = 'type is neither folder nor file!';

// The below getters follow the same structure of recursively (bfs) getting
// data of all files within a folder

// Calculate sum of file sizes
Object.defineProperty(folder, 'filesize', {
	get: function () {
		var sum = 0;
		this.filesArray.forEach(file => {
			sum += file.filesize;
		});
		return sum;
	},
});

// Count the number of files
Object.defineProperty(folder, 'count', {
	get: function () {
		var sum = 0;
		this.filesArray.forEach(file => {
			if (file.type === 'folder') {
				sum += file.count;
			} else if (file.type === 'file') {
				sum++;
			} else {
				console.error(typeError, file);
			}
		});
		return sum;
	},
});

// Return one-dimensional array of all siapaths in this folder
Object.defineProperty(folder, 'paths', {
	get: function () {
		var paths = [];
		this.filesArray.forEach(file => {
			if (file.type === 'folder') {
				paths = paths.concat(file.paths);
			} else if (file.type === 'file') {
				paths.push(file.path);
			} else {
				console.error(typeError, file);
			}
		});
		return paths;
	},
});

module.exports = folder;
