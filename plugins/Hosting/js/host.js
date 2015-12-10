'use strict';

// Manges the lifecycle of the plugin
function host() {
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
	function update(hostInfo) {
		// Store hostInfo results property data
		$.each(hostInfo, function(name, value) {
			props[name].value = value;
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
	}

	// Announce host on the network
	function announce(settings) {
		settings = settings || null;
		Siad.apiCall({
			url: '/host/announce',
			method: 'POST',
			qs: settings,
		}, function() {
			Lifecycle.notify('Host successfully announced!', 'announced');
		});
	}

	// Save hosting settings
	function save(settings) {
		// Revert each value to base units
		$.each(settings, function(name, value) {
			settings[name] = math.revertToBaseUnit(value, props[name].conversion);
		});
		// Send configuration call
		Siad.apiCall({
			url: '/host',
			method: 'POST',
			qs: settings,
		}, function() {
			Lifecycle.notify('Hosting configuration saved!', 'saved');
			Lifecycle.update();
		});
	}

	// Returns array of converted values relevant to settings configuration table
	function resetValues() {
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

	// Expose public members
	return {
		update: update,
		resetValues: resetValues,
		announce: announce,
		save: save,
		address: address,
	};
}

// Requiring this file gives an instance of the above class
module.exports = new host();

