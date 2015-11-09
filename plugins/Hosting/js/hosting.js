'use strict';

// Tracks if host properties have been made
var propsMade = false;

// Define API calls and update DOM per call
function update() {
	// Get HostInfo regularly
	IPC.sendToHost('api-call', '/host/status', 'update');
	updating = setTimeout(update, 15000);
}

// Update host info
addResultListener('update', function(result) {
	hosting = result;

	// Update competitive prices
	$('#hmessage').text('Estimated competitive price: ' + convertSiacoin(hosting.Competition) + ' S per GB/month');

	// Calculate host finances
	var total = formatBytes(hosting.TotalStorage);
	var storage = formatBytes(hosting.TotalStorage - hosting.StorageRemaining);
	var profit = convertSiacoin(hosting.Profit).toFixed(2);
	var potentialProfit = convertSiacoin(hosting.PotentialProfit).toFixed(2);

	// Update host finances
	$('#contracts').text(hosting.NumContracts + ' Contracts');
	$('#storage').text(storage + '/' + total + ' in use');
	$('#profit').text(profit + ' S earned');
	$('#potentialprofit').text(potentialProfit + ' S to be earned');

	if (propsMade) {
		return;
	}
	// From hostProperties, make properties
	hostProperties.forEach(function(prop) {
		var item = $('#propertybp').clone();
		item.removeClass('hidden');
		item.find('.name').text(prop.descr + ' (' + prop.unit + ')');
		var rawVal = new BigNumber(hosting[prop.name].toString());
		var value = rawVal.div(prop.conversion).round(2);
		item.find('.value').text(value);
		item.attr('id', prop.name);

		$('#properties').append(item);
	});
	propsMade = true;
});

// Called upon showing
function start() {
	// DEVTOOL: uncomment to bring up devtools on plugin view
	//IPC.sendToHost('devtools');

	// Start updating
	update();
}

// Called upon transitioning away from this view
function stop() {
	clearTimeout(updating);
}

// Announce button
$('#announce.button').click(function() {
	$('#address.popup').removeClass('hidden');
});
function announce(args) {
	$('#address.popup').addClass('hidden');
	tooltip('Anouncing...', $('#announce').get(0));
	var call = {
		url: '/host/announce',
		type: 'GET',
		args: args,
	};
	IPC.sendToHost('api-call', call, 'announced');
}
$('#custom.button').click(function() {
	announce({
		address: $('#address-field').text(),
	});
});
$('#default.button').click(function() {
	announce({});
});
addResultListener('announced', function() {
	notify('Host successfully announced!', 'announced');
});

// Save button
$('#save.button').click(function() {
	tooltip('Saving...', this);

	// Define configuration settings
	var hostInfo = {};
	hostProperties.forEach(function(prop) {
		var item = $('#' + prop.name);
		var value = new BigNumber(item.find('.value').text()).mul(prop.conversion);
		hostInfo[prop.name.toLowerCase()] = value.round().toString();
	});
	console.log(hostInfo);

	// Define configuration call
	var call = {
		url: '/host/configure',
		type: 'GET',
		args: hostInfo,
	};
	IPC.sendToHost('api-call', call, 'configure');
});
addResultListener('configure', function() {
	update();
	notify('Hosting configuration saved!', 'saved');
});

// Reset button
$('#reset.button').click(function() {
	tooltip('Reseting...', this);
	hostProperties.forEach(function(prop) {
		var item = $('#' + prop.name);
		var value = new BigNumber(hosting[prop.name].toString()).div(prop.conversion);
		item.find('.value').text(value.round(2));
	});
	notify('Hosting configuration reset', 'reset');
});

