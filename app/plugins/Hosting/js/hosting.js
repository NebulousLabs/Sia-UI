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
		'unit': 'SC Per GB Per Month',
		'conversion': 4/1e12
	}
];

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

function formatSiacoin(baseUnits) {
	var ConversionFactor = new BigNumber(10).pow(24);
	var display = new BigNumber(baseUnits).dividedBy(ConversionFactor);
	return display + ' S';
}

// Controls data size representation
function formatBytes(bytes) {
	if (bytes == 0) return '0B';
	var k = 1000;
	var sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	var i = Math.log(bytes)/ Math.log(k);
	return (bytes / Math.pow(k, i)).toPrecision(3) + " " + sizes[i];
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

function addListeners(){
	eAnnounce.onclick = function(){
		tooltip('Anouncing...', this);
		callAPI('/host/announce');
	};
	eSave.onclick = function(){
		tooltip('Saving...', this);
		// var call = {};
		callAPI('/host/configure');
	};
	eReset.onclick = function(){
		tooltip('Reseting...', this);
		for (var i = 0; i < editableProps.length; i++){
			var item = $(eProps[i]);
			var value = parseFloat(ui._hostStatus[editableProps[i]]);
			item.querySelectorAll('.value').textContent = util.round(value * propConversion[i]);
		}
	};
}

function parseHostInfo(){
	var newInfo = {};
	for (var i = 0; i < editableProps.length; i++){
		var item = $(eProps[i]);
		var value = parseFloat(item.querySelectorAll('.value').text());
		newInfo[editableProps[i].toLowerCase()] = value / propConversion[i];
	}
	return newInfo;
}

function update(){
	var total = formatBytes(hostStatus.TotalStorage);
	var remaining = formatBytes(hostStatus.StorageRemaining);
	var storage = formatBytes(hostStatus.TotalStorage - hostStatus.StorageRemaining);
	var profit = hostStatus.Profit;
	var potentialProfit = hostStatus.PotentialProfit;

	eContracts.innerHTML = hostStatus.NumContracts + ' Contracts';
	eStorage.innerHTML = storage + '/' + total + ' in use';
	eRemaining.innerHTML = remaining + ' left';
	eProfit.innerHTML = (util.siacoin(profit)).toFixed(4) + ' KS earned';
	ePotentialProfit.innerHTML = (util.siacoin(potentialProfit)).toFixed(4) + ' KS to be earned';

	var d = new Date();
	if (updateTime < d.getTime() - 15000) {
		document.getElementById('hmessage').innerHTML = 'Estimated Competitive Price: ' + 1000 * util.siacoin(hostStatus.Competition).toFixed(3) + ' SC / GB / Month';
		updateTime = d.getTime();
	}
}

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

	// Make buttons responsive
	addListeners();

	// Create and load all properties
	hostProperties.forEach(function(prop) {
		var item = ePropBlueprint.cloneNode(true).classList.remove('blueprint');
		eProperties.appendChild(item);
		item.querySelector('.name').textContent = prop.name + ' (' + prop.unit + ')';
		var value = hostStatus[prop.name]);
		item.querySelector('.value').textContent = value * prop.conversion;
	});

	// Start updating
	updating = setInterval(update, 1000)
}

function kill() {
	clearInterval(updating);
}

