'use strict';

/*
 * host module:
 *   Tracks hosting properties between the DOM and Siad
 */

// Jquery
const $ = require('jquery');
// Siad wrapper/manager
const Siad = require('sia.js');

// Tracks details about the various hosting properties
var props = require('./hostProperties.js');
// Hold Sia math logic 
var math = require('./hostMath.js');
// Names of configurable host properties
var configurable = ['totalstorage', 'price'];
// Tracks if props have been made
var propsMade = false;

// Called once, builds configurable properties for the user to change their
// hosting settings
function buildProps(hostInfo) {
	// Update host property values
	configurable.forEach(function(name) {
		var prop = props[name];
		var el = $(`
			<div class='property pure-g' id=''>
				<div class='pure-u-2-3'>
					<div class='name'>PROPERTY NAME</div>
				</div>
				<div class='pure-u-1-3'>
					<div class='value' contentEditable='true'>PROPERTY VALUE</div>
				</div>
			</div>
		`);
		el.attr('id', name);
		el.find('.name').text(prop.descr + ' (' + prop.unit + ')');
		el.find('.value').text(math.convertProperty(prop));
		$('#properties').append(el);
	});
}

// Update capsule information
function updateStatus(hostInfo, callback) {
	// Store hostInfo results property data
	$.each(hostInfo, function(name, value) {
		// Try-catch statement to be fault-tolerant. If just one name from the
		// api call result, hostInfo, isn't in hostProperties or has a
		// different name, such as with an unexpected siad version, other
		// properties will still update.
		try {
			props[name].value = value;
		} catch (e) {
			console.error(e);
			console.log('Error updating host properties object:');
			console.log(hostInfo, props);
		}
	});

	// Process host info
	var totalStorage = math.formatByte(props.totalstorage.value);
	var usedStorage = math.formatByte(props.totalstorage.value - props.storageremaining.value);
	var revenue = math.formatSiacoin(props.revenue.value);
	var upcomingRevenue = math.formatSiacoin(props.upcomingrevenue.value);

	// Update host info
	$('#numcontracts').text(math.formatProperty(props.numcontracts));
	$('#storage').text(usedStorage + '/' + totalStorage + ' in use');
	$('#revenue').text(revenue + ' earned');
	$('#upcomingrevenue').text(upcomingRevenue + ' to be earned');

	// If configurable property elements haven't been made, make them
	if (!propsMade) {
		buildProps(hostInfo);
		propsMade = true;
	}

	// Call the callback if it's there
	if (callback) {
		callback();
	}
}

// Retrieve host status information
function getStatus(callback) {
	Siad.apiCall('/host', function(result) {
		updateStatus(result, callback);
	});
}

// Announce host on the network
function announce(settings, callback) {
	settings = settings || null;
	Siad.apiCall({
		url: '/host/announce',
		method: 'POST',
		form: settings,
	}, callback);
}

// Save hosting settings
function save(settings, callback) {
	// Revert each value to base units
	$.each(settings, function(name, value) {
		settings[name] = math.revertToBaseUnit(value, props[name].conversion);
	});
	// Send configuration call
	Siad.apiCall({
		url: '/host',
		method: 'POST',
		form: settings,
	}, callback);
}

// Returns array of converted values relevant to settings configuration table
function reset() {
	var convertedValues = {};
	configurable.forEach(function(name) {
		convertedValues[name] = math.convertProperty(props[name]);
	});
	return convertedValues;
}

// Return ip address 
function address() {
	return props.ipaddress.value;
}

// Requiring this file gives an object with the following functions
module.exports = {
	update: getStatus,
	reset: reset,
	announce: announce,
	save: save,
	address: address,
};
