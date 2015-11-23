'use strict';

// Library for working with clipboard
const Clipboard = require('clipboard');
// Tracks addresses
var addresses = [];
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

function updateAddressPage() {
	$('#address-list').empty();
	var n = (($('#address-page').val() - 1) * 25);
	addresses.slice(n, n + 25).forEach(function(addressObject, index) {
		makeAddress(addressObject.address, n + index + 1);
	});
}

// Update addresses array and page
addResultListener('update-address', function(result) {
	addresses = result.addresses;
	$('#address-page').attr({
		min: 1,
		max: Math.ceil(addresses.length / 25),
	});
	updateAddressPage();
});

$('#address-page').on('input', function() {
	updateAddressPage();
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Search ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Filter address list by search string
function filterAddressList(searchstr) {
	$('#address-list').empty();
	addresses.forEach(function(addressObject) {
		if (addressObject.address.indexOf(searchstr) > -1) {
			makeAddress(addressObject.address);
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

