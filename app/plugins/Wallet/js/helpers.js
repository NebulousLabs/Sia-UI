'use strict';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~ Global Variables ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Library for communicating with Sia-UI
const IPC = require('ipc');
// Library for arbitrary precision in numbers
const BigNumber = require('bignumber.js');
// Ensure precision
BigNumber.config({ DECIMAL_PLACES: 30 });
BigNumber.config({ EXPONENTIAL_AT: 1e+9 });
// Variable to store api result values
var wallet = {};
var remainingAddresses;
var currentHeight;
// Keeps track of if the view is shown
var updating;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~ Helper Functions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// DOM shortcuts
function eID() {
	return document.getElementById.apply(document, [].slice.call(arguments));
}
function show(el) {
	if (typeof el === 'string') {
		eID(el).classList.remove('hidden');
	} else {
		el.classList.remove('hidden');
	}
}
function hide(el) {
	if (typeof el === 'string') {
		eID(el).classList.add('hidden');
	} else {
		el.classList.add('hidden');
	}
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

// Amount has to be a number
function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

// Address has to be lowercase hex and 76 chars
function isAddress(str) {
    return str.match(/^[a-f0-9]{76}$/) !== null;
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
		} else {
			callback(result);
		}
	});
}
