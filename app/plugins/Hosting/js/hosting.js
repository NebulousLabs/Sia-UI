'use strict';
// Library for communicating with Sia-UI
const IPC = require('ipc');
// Library for arbitrary precision in numbers
const BigNumber = require('bignumber.js');
// Ensure precision
BigNumber.config({ DECIMAL_PLACES: 24 });
BigNumber.config({ EXPONENTIAL_AT: 1e+9 });
// Variable to store api result values
var hosting;
// Keeps track of if the view is shown
var updating;

// DOM shortcut
function eID() {
	return document.getElementById.apply(document, [].slice.call(arguments));
}

// Pointers to various DOM elements
var ePropBlueprint, eProperties, eSave, eReset, eAnnounce;
// Hidden div with the structure of a host property
ePropBlueprint = eID('propertybp');
// Section that holds properties
eProperties = eID('properties');
// Buttons for hosting controls
eAnnounce = eID('announce');
eSave = eID('save');
eReset = eID('reset');

// Host properties array
var hostProperties = [
	{
		'name': 'TotalStorage',
		'unit': 'GB',
		// GB is 1e9 Bytes
		'conversion': new BigNumber('1e+9'),
	},{
		'name': 'MaxFilesize',
		'unit': 'MB',
		// MB is 1e6 Bytes
		'conversion': new BigNumber('1e+6'),
	},{
		'name': 'MaxDuration',
		'unit': 'Days',
		// 144 is the number of blocks in a day
		'conversion': new BigNumber(144),
	},{
		'name': 'Price',
		'unit': 'S Per GB Per Month',
		// Siacoin (1e24) / GB (1e9) / blocks in a 30-day month (4320)
		//'conversion': new BigNumber('1e+12').div('4'),
		'conversion': new BigNumber('1e+24').div('1e+9').div(4320),
	},
];

// Convert to Siacoin
function convertSiacoin(hastings) {
	return new BigNumber(hastings).div('1e+24');
}

// Controls data size representation
function formatBytes(bytes) {
	if (bytes === 0) {
		return '0B';
	}
	var k = 1000;
	var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	var i = Math.floor((Math.log(bytes) + 1) / Math.log(k));
	return (new BigNumber(bytes).div(Math.pow(k, i))) + " " + sizes[i];
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

// Define API calls and update DOM per call
function update() {
	// Get HostInfo regularly
	IPC.sendToHost('api-call', '/host/status', 'status');
	updating = setTimeout(update, 15000);
}

// Called upon showing
function show() {
	// DEVTOOL: uncomment to bring up devtools on plugin view
	//IPC.sendToHost('devtools');

	// Start updating
	update();
}

// Called upon transitioning away from this view
function hide() {
	clearTimeout(updating);
}

// Enable buttons
eAnnounce.onclick = function() {
	tooltip('Anouncing...', this);
	IPC.sendToHost('api-call', '/host/announce', 'announce');
};
eSave.onclick = function() {
	tooltip('Saving...', this);
	var hostInfo = {};
	hostProperties.forEach(function(prop) {
		var item = eID(prop.name);
		var value = new BigNumber(item.querySelector('.value').textContent).mul(prop.conversion).round().toString();
		hostInfo[prop.name[0].toLowerCase() + prop.name.substring(1)] = value;
	});
	var call = {
		url: '/host/configure',
		type: 'GET',
		args: hostInfo,
	};
	IPC.sendToHost('api-call', call, 'configure');
};
eReset.onclick = function() {
	tooltip('Reseting...', this);
	hostProperties.forEach(function(prop) {
		var item = eID(prop.name);
		var value = new BigNumber(hosting[prop.name].toString()).div(prop.conversion).round().toString();
		item.querySelector('.value').textContent = value;
	});
};

// Update host info
IPC.on('status', function(err, result) {
	if (err) {
		console.error(err);
		return;
	} else if (!result) {
		console.error('Unknown occurence: no error and no result from API call!');
		return;
	}
	hosting = result;
		
	// Update competitive prices
	eID('hmessage').innerHTML = 'Estimated Competitive Price: ' + convertSiacoin(hosting.Competition) + ' S / GB / Month';
	// Calculate host finances
	var total = formatBytes(hosting.TotalStorage);
	var storage = formatBytes(hosting.TotalStorage - hosting.StorageRemaining);
	var profit = (hosting.Profit).toFixed(2);
	var potentialProfit = convertSiacoin(hosting.PotentialProfit).toFixed(2);
	// Update host finances
	eID('contracts').innerHTML = hosting.NumContracts + ' Contracts';
	eID('storage').innerHTML = storage + '/' + total + ' in use';
	eID('profit').innerHTML = profit + ' S earned';
	eID('potentialprofit').innerHTML = potentialProfit + ' S to be earned';

	// From hostProperties and blueprint, make properties
	hostProperties.forEach(function(prop) {
		if (eID(prop.name)) {
			return;
		}
		var item = ePropBlueprint.cloneNode(true);
		item.classList.remove('blueprint');
		item.querySelector('.name').textContent = prop.name + ' (' + prop.unit + ')';
		var value = new BigNumber(hosting[prop.name].toString()).div(prop.conversion).round().toString();
		item.querySelector('.value').textContent = value;
		item.id = prop.name;

		eProperties.appendChild(item);
	});
});
