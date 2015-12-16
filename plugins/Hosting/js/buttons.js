'use strict';

/*
 * buttons.js:
 *   Adds click action to the DOM that interacts with the modules
 */

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
	Host.save(settings);
});

// Reset button
$('#reset.button').click(function() {
	Lifecycle.tooltip('Reseting...', this);
	var values = Host.reset();
	$.each(values, function(name, value) {
		var item = $('#' + name);
		item.find('.value').text(value);
	});
	Lifecycle.notify('Hosting configuration reset', 'reset');
});

