'use strict';

// Library for communicating with Sia-UI
const IPC = require('ipc');
// Library for arbitrary precision in numbers
const BigNumber = require('bignumber.js');
// Ensure precision
BigNumber.config({ DECIMAL_PLACES: 24 });
BigNumber.config({ EXPONENTIAL_AT: 1e+9 });
// Variable to store api result values
var wallet = {};
var remainingAddresses;
var currentHeight;
// Keeps track of if the view is shown
var updating;

// DOM shortcuts
function eID() {
	return document.getElementById.apply(document, [].slice.call(arguments));
}
function show(el) {
	if (typeof el === 'string') {
		eID(el).classList.remove('blueprint');
	} else {
		el.classList.remove('blueprint');
	}
}
function hide(el) {
	if (typeof el === 'string') {
		eID(el).classList.add('blueprint');
	} else {
		el.classList.add('blueprint');
	}
}

// Convert to Siacoin
function convertSiacoin(hastings) {
	var ConversionFactor = new BigNumber(10).pow(24);
	var display = new BigNumber(hastings).dividedBy(ConversionFactor);
	return display;
}

// Amount has to be a number
function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
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

// Error checking shortcut
function assertSuccess(ipcmsg, err) {
	if (err) {
		console.error(ipcmsg, err);
		notify('API Call errored!', 'error');
		return false;
	} else {
		return true;
	}
}
