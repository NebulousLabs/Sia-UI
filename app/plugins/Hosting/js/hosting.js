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

// Pointers to various DOM elements
var view, ePropBlueprint, eProps, eControl, eSave, eReset, eAnnounce;
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
	return display + ' SC';
}

function init() {
	// DEVTOOL: uncomment to bring up devtools on plugin view
	//IPC.sendToHost('devtools');
	
	// Ensure precision
	BigNumber.config({ DECIMAL_PLACES: 24 })
	BigNumber.config({ EXPONENTIAL_AT: 1e+9 })

	ePropBlueprint = eID('propertybp');
	eAnnounce = eID('announce');
	eSave = eID('save');
	eReset = eID('reset');
	eContracts = eID('contracts');
	eStorage = eID('storage');
	eProfit = eID('profit');
	ePotentialProfit = eID('potentialprofit');

	addListeners();
	updating = setInterval(update, 1000)
}

function kill() {
	clearInterval(updating);
}

function addListeners(){
	eAnnounce.onclick = function(){
		ui._trigger('announce-host');
	};
	eSave.onclick = function(){
		// ui._tooltip(this, 'Saving');
		ui._trigger('save-host-config', parseHostInfo());
	};
	eReset.onclick = function(){
		ui._tooltip(this, 'Reseting');
		for (var i = 0; i < editableProps.length; i++){
			var item = $(eProps[i]);
			var value = parseFloat(ui._data.host.HostInfo[editableProps[i]]);
			item.find('.value').text(util.round(value * propConversion[i]));
		}
	};
}

function parseHostInfo(){
	var newInfo = {};
	for (var i = 0; i < editableProps.length; i++){
		var item = $(eProps[i]);
		var value = parseFloat(item.find('.value').text());
		newInfo[editableProps[i].toLowerCase()] = value / propConversion[i];
	}
	return newInfo;
}

function onViewOpened(data){
	eProps.remove();
	// If this is the first time, create and load all properties
	for (var i = 0; i < editableProps.length; i++){
		var item = ePropBlueprint.clone().removeClass('blueprint');
		ePropBlueprint.parent().append(item);
		eProps = eProps.add(item);
		item.find('.name').text(editableProps[i] + ' ('+ propUnits[i] +')');
		var value = parseFloat(data.host.HostInfo[editableProps[i]]);
		item.find('.value').text(util.round(value * propConversion[i]));
	}
}

function update(data){
	var total = util.formatBytes(data.host.HostInfo.TotalStorage);
	var remaining = util.formatBytes(data.host.HostInfo.StorageRemaining);
	var storage = util.formatBytes(data.host.HostInfo.TotalStorage - data.host.HostInfo.StorageRemaining);
	var profit = data.host.HostInfo.Profit;
	var potentialProfit = data.host.HostInfo.PotentialProfit;

	eContracts.html(data.host.HostInfo.NumContracts + ' Contracts');
	eStorage.html(storage + '/' + total + ' in use');
	eRemaining.html(remaining + ' left')
	eProfit.html((util.siacoin(profit)).toFixed(4) + ' KS earned');
	ePotentialProfit.html((util.siacoin(potentialProfit)).toFixed(4) + ' KS to be earned');

	var d = new Date();
	if (updateTime < d.getTime() - 15000) {
		document.getElementById('hmessage').innerHTML = 'Estimated Competitive Price: ' + 1000 * util.siacoin(data.host.HostInfo.Competition).toFixed(3) + ' SC / GB / Month';
		updateTime = d.getTime();
	}
}
