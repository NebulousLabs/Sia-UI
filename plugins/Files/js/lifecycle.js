'use strict';

/*
 * lifecycle instance module:
 *   Updates plugin periodically
 */

// Node modules
const electron = require('electron');
const ipcRenderer = electron.ipcRenderer;
const BigNumber = require('bignumber.js');
const siad = require('sia.js');
const $ = require('jquery');
const browser = require('./browser');

// Keeps track of if the view is shown
var updating;
// 'all' or 'active'
var hostsType = 'active';
// Hastings per Siacoin (1e24) / B per GB (1e9) / Blocks per 30-day month (4320)
const MONTHLY_DATA_COST = new BigNumber('1e+24').div('1e+9').div('4320');

// Update capsule values with renter status
function updateStatus(result) {
	var priceDisplay;
    var hostsDisplay = hostsType === 'active' ? ' Active Hosts' : ' Hosts';

	// Determine capsule display values
	if (result.hosts) {
		// Calculate average hosting price
		var count = result.hosts.length;
		var prices = result.hosts.map(host => new BigNumber(host.price));
		var avg = prices.reduce((a, b) => a.plus(b))
									.div(count)
									.div(MONTHLY_DATA_COST);
		priceDisplay = `Price: ${avg.round(2)} S/GB/Month`;

		hostsDisplay = result.hosts.length + hostsDisplay;
		// Singular label for only 1 host
		if (count === 1) {
			hostsDisplay = hostsDisplay.slice(0, -1);
		}
	} else {
		priceDisplay = 'Unknown Storage Price';
		hostsDisplay = 'No' + hostsDisplay;
	}
	$('#price.pod').text(priceDisplay);
	// TODO: Could make pod clickable for expanded host information
	$('#host-count.pod span').text(hostsDisplay);
}

// Regularly update the file library and status
function update() {
	// don't update if a file is being renamed
	var renaming = $('#file-list .file').find('[contenteditable=true]').length !== 0;

	if (!renaming) {
		browser.update();
		siad.apiCall('/renter/hosts/' + hostsType, updateStatus);
	}

	updating = setTimeout(update, 15000);
}

// Clicking the host pod toggles it between all hosts and active hosts
$('#host-count.pod').click(function() {
	$('#host-count.pod .fa').toggleClass('fa-globe fa-users');
	hostsType = hostsType === 'active' ? 'all' : 'active';
	update();
});

// Called upon showing
ipcRenderer.on('shown', update);
// Called upon transitioning away from this view
ipcRenderer.on('hidden', function() {
	clearTimeout(updating);
});
