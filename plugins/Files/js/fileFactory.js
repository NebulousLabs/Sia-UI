'use strict';

/*
 * file factory module:
 *   fileFactory, when called, makes a new file object
 */

// File object to make copy instances of
const file = require('./file');

// Factory to create instances of the file object
function fileFactory(arg) {
	// Files can be constructed from either a siapath or a status object
	// returned from /renter/files||downloads
	var f = Object.create(file);
	if (typeof arg === 'object'){
		Object.assign(f, arg);
		f.path = arg.siapath;
	} else if (typeof arg === 'string') {
		f.path = arg;
	} else {
		console.error('Unrecognized constructur argument: ', arguments);
	}

	return f;
}

module.exports = fileFactory;
