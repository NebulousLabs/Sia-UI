'use strict';

/*
 * global.js:
 *   This file is the only js file sourced by the index.html. It defines what
 *   variables are in the DOM's global namespace, sets up button clickability,
 *   and other startup procedures for this plugin
 */

// Library for communicating with Sia-UI
const IPCRenderer = require('electron').ipcRenderer;
// Jquery
const $ = require('jquery');
// Siad wrapper/manager
const Siad = require('sia.js');
// Host settings manager
const Host = require('./js/host.js');
// Lifecycle manager
const Lifecycle = require('./js/lifecycle.js');

// Called upon showing
IPCRenderer.on('shown', Lifecycle.update);
// Called upon transitioning away from this view
IPCRenderer.on('hidden', Lifecycle.stop);

// Make sure Siad settings are in sync with the rest of the UI's
var settings = IPCRenderer.sendSync('config', 'siad');
Siad.configure(settings);

// Slight modification to Siad wrapper for standard error handling
Siad.apiCall = function(callObj, callback) {
	Siad.call(callObj, function(err, result) {
		if (err) {
			console.error(callObj, err);
			Lifecycle.notify(err.toString(), 'error');
		} else {
			callback(result);
		}
	});
};

// Announce button
$('#announce.button').click(function() {
	$('#announce-address.popup').show();
	$('#address-field').val(Host.address());
});
$('#announce-address .confirm.button').click(function() {
	$('#announce-address.popup').hide();
	Lifecycle.tooltip('Anouncing...', $('#announce').get(0));
	Host.announce({
		address: $('#address-field').text(),
	}, function() {
		Lifecycle.notify('Host successfully announced!', 'announced');
	});
});
$('#announce-address .cancel.button').click(function() {
	$('#announce-address.popup').hide();
});

// Save button
$('#save.button').click(function() {
	Lifecycle.tooltip('Saving...', this);

	// Record configuration settings
	var settings = {};
	$('#properties').children().each(function() {
		var value = $(this).find('.value').text();
		settings[this.id] = value;
	});

	// Save configuration settings
	Host.save(settings, function() {
		Host.update(function() {
			Lifecycle.notify('Hosting configuration saved!', 'saved');
		});
	});
});

// Reset button
$('#reset.button').click(function() {
	Lifecycle.tooltip('Reseting...', this);
	Host.update(function() {
		var values = Host.reset();
		$.each(values, function(name, value) {
			var item = $('#' + name);
			item.find('.value').text(value);
		});
		Lifecycle.notify('Hosting configuration reset', 'reset');
	});
});

