'use strict';

/*
 * entity:
 *   entity is akin to a virtual class. It shouldn't be instantiated but is
 *   inherited from by file and folder. Mostly to provide context that files
 *   and folders, although having completely different implementations for most
 *   uses, need to share these properties and methods for the file browser to
 *   be seemlessly operated.
 */

// Helper Node Module
const path = require('path');

let entity = {
	// Abstract members, inheritors must set
	type: 'entity',
	path: '/',
	// Abstract functions, inheritors must implement
	setPath (newPath, cb) {
	},
	delete (cb) {
	},
	download (destination, cb) {
	},
	share (cb) {
	},
	// Virtual functions, can be overwritten
	get name () {
		return path.basename(this.path);
	},
	get directory () {
		return path.dirname(this.path);
	},
	get extension () {
		return path.extname(this.path);
	},
	get nameNoExtension () {
		return path.basename(this.path, this.extension);
	}
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
