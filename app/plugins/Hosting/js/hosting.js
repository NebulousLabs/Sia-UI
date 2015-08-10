'use strict';
// Library for communicating with Sia-UI
const IPC = require('ipc');
// Library for arbitrary precision in numbers
const BigNumber = require('bignumber.js');
// Keeps track of if the view is shown
var updating;
// Keeps track of if listeners were already instantiated
var listening = false;
// DOM shortcut
var eID = function() {
	return document.getElementById.apply(document, [].slice.call(arguments));
};
var hostStatus;

// Pointers to various DOM elements
var view, ePropBlueprint, eProperties, eControl, eSave, eReset, eAnnounce;
var eContracts, eStorage, eRemaining, eProfit, ePotentialProfit;
var updateTime = 0;

var hostProperties = [
	{
		'name': 'TotalStorage',
		'unit': 'GB',
		'conversion': 1/1e9
	},{
		'name': 'MaxFilesize',
		'unit': 'MB',
		'conversion': 1/1e6
	},{
		'name': 'MaxDuration',
		'unit': 'Day',
		'conversion': 1/144
	},{
		'name': 'Price',
		'unit': 'S Per GB Per Month',
		'conversion': 4/1e12
	}
];

// Convert to Siacoin
function convertSiacoin(hastings) {
	var conversionFactor = new BigNumber(10).pow(24);
	var siacoin = new BigNumber(hastings).dividedBy(conversionFactor);
	return siacoin;
}

// Controls data size representation
function formatBytes(bytes) {
	if (bytes == 0) return '0B';
	var k = 1000;
	var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	var i = Math.floor((Math.log(bytes) + 1) / Math.log(k));
	return (bytes / Math.pow(k, i)).toPrecision(3) + " " + sizes[i];
}

// Call API and listen for response to call
function callAPI(call, callback) {
	IPC.sendToHost('api-call', call);
	// prevents adding duplicate listeners
	if (!listening) {
		IPC.on(call, function(err, result) {
			if (err) {
				console.error(err);
			} else if (result) {
				callback(result);
			} else {
				console.error('Unknown occurence: no error and no result from callAPI!');
			}
		});
	}
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
};

function callWithTooltips(call, operation, element) {
	tooltip(operation + '...', element);
	callAPI(call, function(response) {
		console.log('Waiting for Success/Failure...')
		if (response.Success) {
			tooltip(operation + 'Succeeded!', element);
		} else {
			tooltip(operation + 'Failed!', element);
		}
	});
}

function addListeners() {
	eAnnounce.onclick = function() {
		callWithTooltips('/host/announce', 'Announcing', this);
	};
	eSave.onclick = function() {
		var hostInfo = {};
		hostProperties.forEach(function(prop) {
			var item = eID(prop.name);
			var value = item.querySelector('.value').textContent;
			hostInfo[prop.name.toLowerCase()] = value / prop.conversion;
		});
		var call = {
			url: '/host/configure',
			type: 'POST',
			args: hostInfo,
		};
		callWithTooltips(call, 'Saving', this);
	};
	eReset.onclick = function() {
		tooltip('Reseting...', this);
		hostProperties.forEach(function(prop) {
			var item = eID(prop.name);
			var value = hostStatus[prop.name];
			item.querySelector('.value').textContent = value * prop.conversion;
		});
	};
}

function addProperties() {
	hostProperties.forEach(function(prop) {
		var item = ePropBlueprint.cloneNode(true)
		item.classList.remove('blueprint');
		eProperties.appendChild(item);
		item.querySelector('.name').textContent = prop.name + ' (' + prop.unit + ')';
		var value = hostStatus[prop.name];
		item.querySelector('.value').textContent = value * prop.conversion;
		item.id = prop.name;
	});
}

// Define API calls and update DOM per call
function update() {
	// Get HostInfo regularly
	callAPI('/host/status', function(info) {
		hostStatus = info;

		// Only perform these once
		if (!listening) {
			// Make buttons reactive
			addListeners();
			// Create and load all properties
			addProperties();

			listening = true;
		}
			
		// Update fields
		eID('hmessage').innerHTML = 'Estimated Competitive Price: ' + 1000 * convertSiacoin(hostStatus.Competition).toFixed(3) + ' SC / GB / Month';

		var total = formatBytes(hostStatus.TotalStorage);
		var storage = formatBytes(hostStatus.TotalStorage - hostStatus.StorageRemaining);
		var profit = hostStatus.Profit;
		var potentialProfit = hostStatus.PotentialProfit;

		eContracts.innerHTML = hostStatus.NumContracts + ' Contracts';
		eStorage.innerHTML = storage + '/' + total + ' in use';
		eProfit.innerHTML = convertSiacoin(profit).toFixed(2) + ' S earned';
		ePotentialProfit.innerHTML = convertSiacoin(potentialProfit).toFixed(2) + ' S to be earned';
	});
}

// Called upon showing
function init() {
	// DEVTOOL: uncomment to bring up devtools on plugin view
	//IPC.sendToHost('devtools');
	
	// Ensure precision
	BigNumber.config({ DECIMAL_PLACES: 24 })
	BigNumber.config({ EXPONENTIAL_AT: 1e+9 })

	// Assign DOM elements to var shortcuts
	ePropBlueprint = eID('propertybp');
	eProperties = eID('properties');
	eAnnounce = eID('announce');
	eSave = eID('save');
	eReset = eID('reset');
	eContracts = eID('contracts');
	eStorage = eID('storage');
	eProfit = eID('profit');
	ePotentialProfit = eID('potentialprofit');

	// Start updating
	update();
	updating = setInterval(update, 15000)
}

// Called upon transitioning away from this view
function kill() {
	clearInterval(updating);
}

