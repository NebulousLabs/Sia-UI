'use strict';
// Library for communicating with Sia-UI
const IPC = require('ipc');
// Library for arbitrary precision in numbers
const BigNumber = require('bignumber.js');
// Ensure precision
BigNumber.config({ DECIMAL_PLACES: 24 });
BigNumber.config({ EXPONENTIAL_AT: 1e+9 });
// Variable to store api result values
var renting = {};
// Keeps track of if the view is shown
var updating;


// DOM shortcuts
function eID() {
	return document.getElementById.apply(document, [].slice.call(arguments));
}
function qS(query, element) {
	return element.querySelector(query);
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

// Make file from blueprint
function addFile(file) {
	// Add to memory
	files[file.Nickname] = file;

	// Represent in markup
	if (eID(file.Nickname)) {
		return;
	}
	var f = eID('filebp').cloneNode(true);
	f.id = file.Nickname;
	qs('.name', f).innerHTML = file.Nickname;
	qs('.size', f).innerHTML = file.Filesize;
	if (f.UploadProgress === 0) {
		qs('.time', f).innerHTML = 'Processing...';
	} else if (fileObject.UploadProgress < 100) {
		qs('.time', f).innerHTML = fileObject.UploadProgress.toFixed(2) + '%');
	} else {
		qs('.time', f).innerHTML = file.TimeRemaining + ' Blocks Remaining';
	}


	// Display file
	eID('file-browser').appendChild(f);
	show(f);
}
