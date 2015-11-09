'use strict';

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~ Global Variables ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Ensure precision
BigNumber.config({ DECIMAL_PLACES: 30 });
BigNumber.config({ EXPONENTIAL_AT: 1e+9 });

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~ Helper Functions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// DOM shortcut to use document.getElementById();
function eID(id) {
	return document.getElementById(id);
}

// Removes the 'hidden' class of an element in order to show it
function show(el) {
	if (typeof el === 'string') {
		eID(el).classList.remove('hidden');
	} else {
		el.classList.remove('hidden');
	}
}

// Hides the 'hidden' class of an object in order to show it
function hide(el) {
	if (typeof el === 'string') {
		eID(el).classList.add('hidden');
	} else {
		el.classList.add('hidden');
	}
}

// DOM shortcut to use document.getElementByClassName();
function eClass(name) {
	return document.getElementsByClassName(name);
}

// Applies an onclick handler to each element with a given class name
function classOnClick(name, reaction) {
	var elements = eClass(name);
	for (var i = 0; i < elements.length; i++) {
		elements[i].onclick = reaction;
	}
}

// Convert to Siacoin
// TODO: Enable commas for large numbers
function convertSiacoin(hastings) {
	// TODO: JS automatically loses precision when taking numbers from the API.
	// This deals with that imperfectly
	var number = new BigNumber(hastings);
	var ConversionFactor = new BigNumber(10).pow(24);
	return number.dividedBy(ConversionFactor).round(2);
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
