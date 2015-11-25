'use strict';

// Library for working with clipboard
const Clipboard = require('clipboard');
// Tracks addresses
var addresses = [];
// Tracks addresses fitting a search string
var matchingAddresses = [];

// Get transactions for a specific wallet address
function updateAddrTxn(event) {
	$('#transaction-list').empty();
	IPCRenderer.sendToHost('api-call', {
		url: '/wallet/transactions/' + event.target.innerText,
		type: 'GET',
	}, 'update-history');
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Address Page ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Make wallet address html element
function makeAddress(address, number) {
	// Make and store a jquery element for the address
	var element = $(`
		<div class='entry' id='` + address + `'>
			<div class='listnum'>` + number + `</div>
			<div class='address'>` + address + `</div>
			<div class='copy-address'><i class='fa fa-clipboard'></i></div>
		</div>
	`);

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

// Fill address page with search results or addresses
function updateAddressPage() {
	if (!$('#address-page').val()) {
		return;
	}
	$('#address-list').empty();

	// Determine if search or normal page 
	var array = $('#search-bar').val() ? matchingAddresses : addresses;
	$('#address-page').attr({
		min: 1,
		max: array.length === 0 ? 1 : Math.ceil(array.length / 25),
	});

	// Make elements for this page
	var n = (($('#address-page').val() - 1) * 25);
	array.slice(n, n + 25).forEach(function(addressObject, index) {
		var number = addressObject.number || n + index + 1;
		makeAddress(addressObject.address, number);
	});
}

// Update addresses array and page
addResultListener('update-addresses', function(result) {
	addresses = result.addresses;
	updateAddressPage();
});

// Update addresses on page navigation
$('#address-page').on('input', updateAddressPage);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Search ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Filter address list by search string
function filterAddressList(searchstr) {
	// Clear last search
	matchingAddresses = [];

	// Find matching addresses and record their original index in search array
	addresses.forEach(function(addressObject, index) {
		if (addressObject.address.indexOf(searchstr) > -1) {
			matchingAddresses.push({
				address: addressObject.address,
				number: index + 1,
			});
		}
	});
}

// Show addresses based on search bar string
function performSearch() {
	var bar = $('#search-bar');

	// Don't search an empty string
	if (bar.val().length !== 0) {
		tooltip('Searching...', bar.get(0));
		filterAddressList(bar.val());
	}
	
	// Reset page number and update
	$('#address-page').val(1);
	updateAddressPage();
}

// Start search when typing in Search field
$('#search-bar').on('input', performSearch);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ New Address ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Find location of address in addresses array
function locationOf(element, array, start, end) {
	start = start || 0;
	end = end || array.length;
	var pivot = parseInt(start + (end - start) / 2, 10);
	if (array[pivot].address === element) {
		return pivot;
	} else if (end - start <= 1) {
		return array[pivot].address > element ? pivot - 1 : pivot;
	} else if (array[pivot].address < element) {
		return locationOf(element, array, pivot, end);
	} else {
		return locationOf(element, array, start, pivot);
	}
}

// Insert address into the sorted array
function addAddress(address) {
	addresses.splice(locationOf(address, addresses) + 1, 0, address);
}

// Add the new address
addResultListener('new-address', function(result) {
	notify('New address created', 'created');
	addAddress(result.address);
	filterAddressList(result.address);
});

