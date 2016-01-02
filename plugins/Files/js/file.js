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

var file = {
	type: 'file',
	// Changes file's nickname with siad call
	setPath (newPath, cb) {
		var self = this;
		siad.apiCall({
			url: '/renter/files/rename',
			qs: {
				nickname: self.path,
				newname: newPath,
			}
		}, function() {
			self.path = newPath;
			if (cb) {
				cb(newPath);
			}
		});
	},
	// Return file size
	// TODO: I'm not 100% sure, but making this a
	// getter doesn't work because Object.assign()
	// evaluates getters
	size () {
		return this.Filesize;
	},
	// Update/record file stats
	update (stats) {
		Object.assign(this, stats);
		this.path = stats.Nickname;
	},
	// The below are just function forms of the renter calls a file can enact
	// on itself, see the API.md
	// https://github.com/NebulousLabs/Sia/blob/master/doc/API.md#renter
	delete (cb) {
		var self = this;
		siad.apiCall({
			url: '/renter/files/delete',
			qs: {
				nickname: self.path,
			},
		}, cb);
	},
	download (destination, cb) {
		var self = this;
		siad.apiCall({
			url: '/renter/files/download',
			qs: {
				nickname: self.path,
				destination: destination,
			},
		}, cb);
	},
	share (filepath, cb) {
		var self = this;
		siad.apiCall({
			url: '/renter/files/share',
			qs: {
				nickname: self.path,
				filepath: filepath + '.sia',
			},
		}, cb);
	},
	shareASCII (cb) {
		var self = this;
		siad.apiCall({
			url: '/renter/files/shareascii',
			qs: {
				nickname: self.path,
			},
		}, cb);
	},
};

// Factory to create instances of the file object
function fileFactory(arg) {
	// Files can be constructed from either a nickname or a status object
	// returned from /renter/files/list||downloadqueue
	var f = Object.assign(Object.create(entity), file);
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
