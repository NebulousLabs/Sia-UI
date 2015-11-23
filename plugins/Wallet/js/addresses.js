'use strict';

// Library for working with clipboard
const Clipboard = require('clipboard');
// Keeps track of number of addresses
var addressCount = 0;
// Keeps track of if the user is typing into the search bar
var typing;

// Get transactions for a specific wallet address
function updateAddrTxn(event) {
	$('#transaction-list').empty();
	IPC.sendToHost('api-call', {
		url: '/wallet/transactions/' + event.target.innerText,
		type: 'GET',
	}, 'update-history');
}

// Make wallet address html element
function makeAddress(address, callback) {
	// Create only new addresses
	if (typeof(address) === 'undefined') { return; }
	if ($('#' + address).length !== 0) { return; }
	addressCount++;

	// Make and store a jquery element for the address
	var addr = $(`
		<div class='entry' id='` + address + `'>
			<div class='listnum'>` + addressCount + `</div>
			<div class='address'>` + address + `</div>
			<div class='copy-address'><i class='fa fa-clipboard'></i></div>
		</div>
	`);

	process.nextTick(function() {
		callback(addr);
	});
}

// Append the wallet address
function appendAddress(element) {
	// Make clicking this address show relevant transactions
	element.find('.address').click(updateAddrTxn);
	// Make copy-to-clipboard button clickable
	element.find('.copy-address').click(function() {
		Clipboard.writeText(this.parentNode.id);
		notify('Copied address to clipboard', 'copied');
	});

	// Append and show the address element
	$('#address-list').append(element);
}

// Make and append a single address
function addAddress(address) {
	makeAddress(address, appendAddress);
}

// From an array of addresses, make elements then insert into the page in a
// semi-non-blocking manner
// TODO: Could this be done better?
function addAddresses(addresses) {
	var count = 0;
	// With setTimeout being async, this for loop queues up the address
	// creation almost instantly, letting them get made and appended one by one
	addresses.forEach(function(address) {
		count++;
		setTimeout(function() {
			addAddress(address.address);
		}, count);
	});
}

// Add addresses to page
addResultListener('update-address', function(result) {
	// Update address list
	addAddresses(result.addresses);

	/* Fetch all wallet transactions by iterate over wallet addresses
	var loopmax = result.addresses.length;
	var counter = 0;
	(function next() {
		setTimeout(function() {
			updateAddrTxn(result.addresses[counter].address);
			next();
		}, 50); // force 50 ms delay between each GET request
	})();*/
});

// Filter address list by search string
function filterAddressList(searchstr) {
	var entries = $('#address-list').children();
	entries.each(function(index, entry) {
		if ($(entry).find('.address').html().indexOf(searchstr) > -1) {
			$(entry).show();
		} else {
			$(entry).hide();
		}
	});
}

// Start search when typing in Search field
$('#search-bar').keyup(function(event) {
	clearTimeout(typing);
	typing = setTimeout(function() {
		tooltip('Searching...', event.target);
		var searchstr = $('#search-bar').val();
		filterAddressList(searchstr);
	}, 200);
});

// Add the new address
addResultListener('new-address', function(result) {
	notify('New address created', 'created');
	addAddress(result.address);
	filterAddressList(result.address);
});


