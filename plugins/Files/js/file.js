'use strict';

/*
 * file:
 *   file is an object literal that inherits from entity by instantiating one
 *   and assigning more specific members on top of it. It's meant to interpret,
 *   hold, and change information about renter files
 */

// Inherits from entity
const entity = require('./entity');
// siad wrapper/manager
const siad = require('sia.js');

let file = Object.assign(Object.create(entity), {
	type: 'file',
	// Changes file's nickname with siad call
	setPath (newPath, cb) {
		siad.apiCall({
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
	// The below are just function forms of the renter calls a file can enact
	// on itself, see the API.md
	// https://github.com/NebulousLabs/Sia/blob/master/doc/API.md#renter
	delete (cb) {
		siad.apiCall({
			url: '/renter/files/delete',
			qs: {
				nickname: this.path,
			},
		}, cb);
	},
	download (destination, cb) {
		siad.apiCall({
			url: '/renter/files/download',
			qs: {
				nickname: this.path,
				destination: destination,
			},
		}, cb);
	},
	share (filepath, cb) {
		siad.apiCall({
			url: '/renter/files/share',
			qs: {
				nickname: this.path,
				filepath: filepath + '.sia',
			},
		}, cb);
	},
	shareASCII (cb) {
		siad.apiCall({
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
	} else {
		console.error('Unrecognized constructur argument: ', arguments);
	}
	return f;
}

module.exports = fileFactory;
