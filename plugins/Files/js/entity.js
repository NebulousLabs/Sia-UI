'use strict';

/*
 * entity class module:
 *   entity is akin to a virtual class. It shouldn't be instantiated but is
 *   inherited from by file and folder. Mostly to provide context that files
 *   and folders, although having completely different implementations for most
 *   uses, need to share these properties and methods for the file browser to
 *   be seemlessly operated.
 */

// Node modules
const path = require('path');
const $ = require('jquery');

var entity = {
	// Abstract members, inheritors must set
	type:     'entity',
	path:     '',

	// Common members
	selected: false,

	// Abstract functions, inheritors must implement
	setPath (newPath, cb) {
	},
	delete (cb) {
	},
	download (destination, cb) {
	},
	share (cb) {
	},

	// Common functions
	// Used for debugging purposes, returns 'this' from the object definition
	// POV. Helpful to demystify Object.assign and Object.create
	get self () {
		return this;
	},
	select () {
		this.selected = true;
	},
	deselect () {
		this.selected = false;
	},
	get name () {
		return path.basename(this.path);
	},
	get directory () {
		var directory = path.dirname(this.path);
		// Prevent path.dirname from returning '.'
		return (directory === '.' ? '' : directory);
	},
	get folderNames () {
		var folders = this.directory.split('/');
		// Prevent string.split from returning ['']
		return (folders[0] === '' ? [] : folders);
	},
	get parentFolders () {
		var parentFolders = [];
		// iterate through parentFolder links to populate parentFolders
		for (let i = this.parentFolder; i; i = i.parentFolder) {
			parentFolders.push(i);
		}
		return parentFolders.reverse();
	},
	get extension () {
		return path.extname(this.path);
	},
	get nameNoExtension () {
		return path.basename(this.path, this.extension);
	},

	// These can't use set syntax because they're necessarily asynchronous
	setName (newName, cb) {
		var newPath = `${this.directory}/${newName}`;
		this.setPath(newPath, cb);
	},
	setDirectory (newDirectory, cb) {
		var newPath = `${newDirectory}/${this.name}`;
		this.setPath(newPath, cb);
	},
	setExtension (newExtension, cb) {
		var newPath = `${this.directory}/${this.nameNoExtension}${newExtension}`;
		this.setPath(newPath, cb);
	},
};

module.exports = entity;
