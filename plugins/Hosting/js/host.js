'use strict';

// Manges the lifecycle of the plugin
function host() {
	// Tracks details about the various hosting properties
	var props = require('./hostData.js');
	// Hold Sia math logic 
	var S = require('./siaMath.js');
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
			el.find('.value').text(S.convert(prop));
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
		var totalStorage = S.formatByte(props.totalstorage);
		var usedStorage = S.formatSiacoin(props.totalstorage.value - props.storageremaining.value);
		var revenue = S.formatSiacoin(props.revenue);
		var upcomingRevenue = S.formatSiacoin(props.upcomingrevenue);

		// Update host info
		$('#numcontracts').text(S.format(props.numcontracts));
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
		Daemon.apiCall({
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
			settings[name] = S.revert(value, props[name].conversion);
		});
		// Send configuration call
		Daemon.apiCall({
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
			convertedValues[name] = S.convert(props[name]);
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

