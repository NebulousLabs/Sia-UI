'use strict';

// Announce button
$('#announce.button').click(function() {
	$('#address.popup').show();
	$('#address-field').val(Host.address());
});
$('#custom.button').click(function() {
	$('#address.popup').hide();
	Lifecycle.tooltip('Anouncing...', $('#announce').get(0));
	Host.announce({
		address: $('#address-field').text(),
	});
});
$('#default.button').click(function() {
	Lifecycle.tooltip('Anouncing...', $('#announce').get(0));
	$('#address.popup').hide();
	Host.announce();
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
	var values = Host.resetValues();
	$.each(values, function(name, value) {
		var item = $('#' + name);
		item.find('.value').text(value);
	});
	Lifecycle.notify('Hosting configuration reset', 'reset');
});

