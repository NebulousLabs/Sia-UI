'use strict';

/*
 * file factory module:
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
	setPath (newPath, callback) {
		if (typeof newPath !== 'string') {
			console.error('Improper argument!', newPath);
			return;
		}
		siad.apiCall({
			url: '/renter/rename/' + this.path ,
			method: 'POST',
			qs: {
				newname: newPath,
			},
		}, () => {
			this.path = newPath;
			if (callback) {
				callback(newPath);
			}
		});
	},
	// Update/record file stats
	update (stats) {
		Object.assign(this, stats);
		this.path = stats.nickname;
	},
	// The below are just function forms of the renter calls a file can enact
	// on itself, see the API.md
	// https://github.com/NebulousLabs/Sia/blob/master/doc/API.md#renter
	delete (callback) {
		siad.apiCall({
			url: '/renter/delete/' + this.path,
			method: 'POST',
		}, result => {
			delete this.parentFolder.contents[this.name];
			callback(result);
		});
	},
	download (destination, callback) {
		if (typeof destination !== 'string') {
			console.error('Improper argument!', destination);
			return;
		}
		siad.apiCall({
			url: '/renter/download/' + this.path,
			qs: {
				destination: destination,
			},
		}, callback);
	},
	share (destination, callback) {
		if (typeof destination !== 'string' || destination.slice(-4) !== '.sia') {
			console.error('Improper argument!', destination);
			return;
		}
		siad.apiCall({
			url: '/renter/share/' + this.path,
			qs: {
				filepath: destination,
			},
		}, callback);
	},
	shareASCII (callback) {
		siad.apiCall({
			url: '/renter/shareascii/' + this.path,
		}, callback);
	},
};

// Factory to create instances of the file object
function fileFactory(arg) {
	// Files can be constructed from either a nickname or a status object
	// returned from /renter/list||downloadqueue
	var f = Object.assign(Object.create(entity), file);
	if (typeof arg === 'object'){
		Object.assign(f, arg);
		f.path = arg.nickname;
	} else if (typeof arg === 'string') {
		f.path = arg;
	} else {
		console.error('Unrecognized constructur argument: ', arguments);
	}

	// TODO: How to place a getter in the object definition without it being
	// Return file size
	Object.defineProperty(f, 'size', {
		get: function () {
			return this.Filesize;
		},
	});

	return f;
}

module.exports = fileFactory;
