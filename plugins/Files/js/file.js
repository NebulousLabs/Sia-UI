'use strict';

/*
 * file class module:
 *   file is an object literal meant to interpret, hold, and change
 *   information about renter files. 
 */

// Node modules
const path = require('path');
const $ = require('jquery');
const siad = require('sia.js');

var file = {
	type:     'file',
	path:     '',

	// Update/record file stats
	update (stats) {
		Object.assign(this, stats);
		this.path = stats.nickname;
	},

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
				destination: destination,
			},
		}, callback);
	},
	shareASCII (callback) {
		siad.apiCall({
			url: '/renter/shareascii/' + this.path,
		}, callback);
	},

	// Common functions
	get name () {
		// path of 'foo/bar/baz' would return 'baz'
		return path.basename(this.path);
	},
	get directory () {
		// path of 'foo/bar/baz' would return 'foo/bar'
		var directory = path.dirname(this.path);
		// Prevent path.dirname from returning '.'
		return (directory === '.' ? '' : directory);
	},
	get folderNames () {
		// path of 'foo/bar/baz' would return ['foo', 'bar']
		return this.directory.split('/');
	},
	get parentFolders () {
		// path of 'foo/bar/baz' would return folder objects whose paths are
		// ['foo', 'foo/bar'] respectively
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
	get size () {
		return this.filesize;
	},
	get count () {
		return 1;
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

module.exports = file;
