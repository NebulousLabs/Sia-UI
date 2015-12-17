'use strict';

// Inherits from entity
const entity = require('./entity');
// Siad wrapper/manager
const Siad = require('sia.js');
// Path Node module
const Path = require('path');

/*
 * file:
 *   file is an object literal that inherits from entity by instantiating one
 *   and assigning more specific members on top of it. It's meant to interpret,
 *   hold, and change information about renter files
 */

let file = Object.assign(Object.create(entity), {
	type: 'file',
	// Changes file's nickname with Siad call
	setPath (newPath, cb) {
		Siad.apiCall({
			url: '/renter/files/rename',
			qs: {
				nickname: this.path,
				newname: newPath,
			}
		}, function() {
			this.path = newPath;
			if (cb) {
				cb(newPath);
			}
		});
	},
	/*
	 * TODO: Don't know if this is needed yet
	get extension () {
		return Path.extname(this.path);
	},
	get nameNoExtension () {
		return Path.basename(this.path, this.extension);
	}
	setExtension (newExtension, cb) {
		var newPath = `${this.directory}/${thi.nameNoExtension}${newExtension}`;
		this.setPath(newPath, cb);
	},
	*/
	// The below are just function forms of the renter calls a function can
	// enact on itself, see the API.md
	// https://github.com/NebulousLabs/Sia/blob/master/doc/API.md#renter
	delete (cb) {
		Siad.apiCall({
			url: '/renter/files/delete'
			qs: {
				nickname: this.path,
			},
		}, cb);
	},
	download (destination, cb) {
		Siad.apiCall({
			url: '/renter/files/download',
			qs: {
				nickname: this.path,
				destination: destination,
			},
		}, cb);
	},
	share (filepath, cb) {
		Siad.apiCall({
			url: '/renter/files/share',
			qs: {
				nickname: this.path,
				filepath: filepath + '.sia',
			},
		}, cb);
	},
	shareASCII (cb) {
		Siad.apiCall({
			url: '/renter/files/shareascii',
			qs: {
				nickname: this.path,
			},
		}, cb);
	},
});

// Factory to create instances of the file object
function fileFactory(arg, browser) {
	// Files can be constructed from either a nickname or a status object
	// returned from /renter/files/list||downloadqueue
	let f = Object.create(file);
	if (typeof arg === 'object'){
		Object.assign(f, arg);
		f.path = arg.Nickname;
	} else if (typeof arg === 'string') {
		f.path = arg;
	}
	return f;
}

module.exports = fileFactory;
