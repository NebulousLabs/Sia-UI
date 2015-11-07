'use strict';

// Library for communicating with Sia-UI
const IPC = require('ipc');
// Library for arbitrary precision in numbers
const BigNumber = require('bignumber.js');
// Library for working with clipboard
const Clipboard = require('clipboard');
// File system module
const Fs = require('fs');
// Module for handling and transforming file paths
const Path = require('path');
// Ensure precision
BigNumber.config({ DECIMAL_PLACES: 24 });
BigNumber.config({ EXPONENTIAL_AT: 1e+9 });
// Variable to store api result values
var renting = {};
// Keeps track of if the view is shown
var updating;

// DOM shortcuts
function eID(id) {
	return document.getElementById(id);
}
function toElement(el) {
	if (typeof el === 'string') {
		return eID(el);
	}
	return el;
}
function show(el) {
	toElement(el).classList.remove('hidden');
}
function hide(el) {
	toElement(el).classList.add('hidden');
}
function hidden(el) {
	return toElement(el).classList.contains('hidden');
}
function nameFromPath(path) {
	return path.replace(/^.*[\\\/]/, '');
}

// Convert to Siacoin
// TODO: Enable commas for large numbers
function convertSiacoin(hastings) {
	// TODO: JS automatically loses precision when taking numbers from the API.
	// This deals with that imperfectly
	var number = new BigNumber(Math.round(hastings).toString());
	var ConversionFactor = new BigNumber(10).pow(24);
	return number.dividedBy(ConversionFactor).round();
}

// Notification shortcut 
function notify(msg, type) {
	IPC.sendToHost('notify', msg, type);
}

// Ask UI to show tooltip bubble
function tooltip(message, element) {
	var rect = element.getBoundingClientRect();
	IPC.sendToHost('tooltip', message, {
		top: rect.top,
		bottom: rect.bottom,
		left: rect.left,
		right: rect.right,
		height: rect.height,
		width: rect.width,
		length: rect.length,
	});
}

// IPC API listening shortcut that checks for errors
function addResultListener(channel, callback) {
	IPC.on(channel, function(err, result) {
		if (err) {
			console.error(channel, err);
			notify(err, 'error');
		} else if (callback) {
			callback(result);
		}
	});
}

// Control data size representation
function formatBytes(bytes, decimals) {
	if (!bytes) {
		return '0B';
	}
	var k = 1000;
	var dm = decimals + 1 || 3;
	var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	var i = Math.floor(Math.log(bytes + 1) / Math.log(k)); // new
	return (bytes / Math.pow(k, i)).toPrecision(dm) + ' ' + sizes[i];
}

/**
 * Checks whether a path starts with or contains a hidden file or a folder.
 * @param {string} source - The path of the file that needs to be validated.
 * returns {boolean} - `true` if the source is blacklisted and otherwise `false`.
 */
function isUnixHiddenPath(path) {
	return (/(^|\/)\.[^\/\.]/g).test(path);
}

