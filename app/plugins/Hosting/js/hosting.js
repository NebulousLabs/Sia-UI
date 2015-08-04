'use strict';
// Library for communicating with Sia-UI
const IPC = require('ipc');
// Library for arbitrary precision in numbers
const BigNumber = require('bignumber.js');
// Variables to store api result values
var balance = 0;
// Keeps track of if the view is shown
var updating;

var view, ePropBlueprint, eProps, eControl, eSave, eReset, eAnnounce;
var eContracts, eStorage, eRemaining, eProfit, ePotentialProfit;
var updateTime = 0;

var hostProperties = [
    {
        "name": "TotalStorage",
        "unit": "GB",
        "conversion": 1/1e9
    },{
        "name": "MaxFilesize",
        "unit": "MB",
        "conversion": 1/1e6
    },{
        "name": "MaxDuration",
        "unit": "Day",
        "conversion": 1/144
    },{
        "name": "Price",
        "unit": "SC Per GB Per Month",
        "conversion": 4/1e12
    }
];

// TODO: don't generate these, just use hostProperties
var editableProps = hostProperties.map(function(obj){
    return obj["name"];
});
var propUnits = hostProperties.map(function(obj){
    return obj["unit"];
});
var propConversion = hostProperties.map(function(obj){
    return obj["conversion"];
});
var lastHostInfo;


function callAPI() {
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

    view = $("#hosting");

    ePropBlueprint = view.find(".property.blueprint");
    eAnnounce = view.find(".announce");
    eControl = view.find(".control");
    eProps = $();
    eSave = view.find(".control .save");
    eReset = view.find(".control .reset");
    eContracts = view.find(".contracts");
    eStorage = view.find(".storage");
    eRemaining = view.find(".remaining");
    eProfit = view.find(".profit");
    ePotentialProfit = view.find(".potentialprofit");

    addEvents();
	updating = setInterval(updating, 1000)
}

function kill() {
	clearInterval(updating);
}

function addEvents(){
    eAnnounce.click(function(){
        ui._trigger("announce-host");
    });
    eSave.click(function(){
        ui._tooltip(this, "Saving");
        ui._trigger("save-host-config", parseHostInfo());
    });
    eReset.click(function(){
        ui._tooltip(this, "Reseting");
        for (var i = 0; i < editableProps.length; i++){
            var item = $(eProps[i]);
            var value = parseFloat(ui._data.host.HostInfo[editableProps[i]]);
            item.find(".value").text(util.round(value * propConversion[i]));
        }
    });
}

function parseHostInfo(){
    var newInfo = {};
    for (var i = 0; i < editableProps.length; i++){
        var item = $(eProps[i]);
        var value = parseFloat(item.find(".value").text());
        newInfo[editableProps[i].toLowerCase()] = value / propConversion[i];
    }
    return newInfo;
}

function onViewOpened(data){
    eProps.remove();
    // If this is the first time, create and load all properties
    for (var i = 0; i < editableProps.length; i++){
        var item = ePropBlueprint.clone().removeClass("blueprint");
        ePropBlueprint.parent().append(item);
        eProps = eProps.add(item);
        item.find(".name").text(editableProps[i] + " ("+ propUnits[i] +")");
        var value = parseFloat(data.host.HostInfo[editableProps[i]]);
        item.find(".value").text(util.round(value * propConversion[i]));
    }
}

function update(data){
    var total = util.formatBytes(data.host.HostInfo.TotalStorage);
    var remaining = util.formatBytes(data.host.HostInfo.StorageRemaining);
    var storage = util.formatBytes(data.host.HostInfo.TotalStorage - data.host.HostInfo.StorageRemaining);
    var profit = data.host.HostInfo.Profit;
    var potentialProfit = data.host.HostInfo.PotentialProfit;

    eContracts.html(data.host.HostInfo.NumContracts + " Contracts");
    eStorage.html(storage + "/" + total + " in use");
    eRemaining.html(remaining + " left")
    eProfit.html((util.siacoin(profit)).toFixed(4) + " KS earned");
    ePotentialProfit.html((util.siacoin(potentialProfit)).toFixed(4) + " KS to be earned");

	var d = new Date();
	if (updateTime < d.getTime() - 15000) {
    	document.getElementById("hmessage").innerHTML = "Estimated Competitive Price: " + 1000 * util.siacoin(data.host.HostInfo.Competition).toFixed(3) + " SC / GB / Month";
		updateTime = d.getTime();
	}
}
