'use strict';

// Helper Node Module
const Path = require('path');

/*
 * entity:
 *   entity is akin to a virtual class. It shouldn't be instantiated but is
 *   inherited from by file and folder. Mostly to provide context that files
 *   and folders, although having completely different implementations for most
 *   uses, need to share these properties and methods for the file browser to
 *   be seemlessly operated.
 */

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
		return Path.basename(this.path);
	},
	get directory () {
		return Path.dirname(this.path);
	},
	// These can't use set syntax because they're necessarily asynchronous
	setName (newName, cb) {
		var newPath = this.path + newName;
		this.setPath(newPath, cb);
	},
	setPath (newPath, cb) {
		var newPath = newPath + this.name;
		this.setPath(newPath, cb);
	},
};

module.exports = entity;
