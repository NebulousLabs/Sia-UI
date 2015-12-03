'use strict';

// Library for working with clipboard
const Clipboard = require('clipboard');
// Tracks addresses
var addresses = [];
// Tracks addresses fitting a search string
var searchedAddresses = [];

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Address Page ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Make wallet address html element
function makeAddress(address, number) {
	// Make and store a jquery element for the address
	var element = $(`
		<div class='entry' id=''>
			<div class='listnum'></div>
			<div class='address'></div>
		</div>
	`);
	element.attr('id', address);
	element.find('.listnum').text(number);
	element.find('.address').text(address);

	// Make clicking this address show relevant transactions
	element.find('.address').click(function(event) {
		updateTransactionCriteria({
			address: event.target.id,
		});
	});

	// Append and show the address element
	$('#address-list').append(element);
}

// Fill address page with search results or addresses
function updateAddressPage() {
	// TODO: Merge this into Transaction's filter criteria and make an overall
	// settings object, perhaps just as a member of the `wallet` object
	var itemsPerPage = 25;
	$('#address-list').empty();

	// Determine if search or normal page 
	var array = $('#search-bar').val() ? searchedAddresses : addresses;
	var maxPage = array.length === 0 ? 1 : Math.ceil(array.length / itemsPerPage);
	$('#address-page').attr({
		min: 1,
		max: maxPage,
	});
	$('#address-page').next().text('/' + maxPage);

	// Make elements for this page
	var n = (($('#address-page').val() - 1) * itemsPerPage);
	array.slice(n, n + itemsPerPage).forEach(function(addressObject, index) {
		var number = addressObject.number || n + index + 1;
		makeAddress(addressObject.address, number);
	});
}

// Retrieves address list from siad
function getAddresses() {
	IPCRenderer.sendToHost('api-call', {
		url: '/wallet/addresses',
		type: 'GET',
	}, 'update-addresses');
}

// Update addresses array and page
addResultListener('update-addresses', function(result) {
	addresses = result.addresses;
	updateAddressPage();
});

// Update addresses on page navigation
$('#address-page').on('input', updateAddressPage);

// Refresh button
$('#view-all-addresses').click(function() {
	$('#search-bar').val('');
	getAddresses();
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Search ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Filter address list by search string
function filterAdresses(searchstr) {
	// Record original index
	addresses.forEach(function(addressObject, index) {
		addressObject.number = index + 1;
	});

	// Filter
	searchedAddresses = addresses.filter(function(addressObject) {
		return (addressObject.address.indexOf(searchstr) > -1);
	});
}

// Show addresses based on search bar string
function performSearch() {
	var bar = $('#search-bar');

	// Don't search an empty string
	if (bar.val().length !== 0) {
		tooltip('Searching...', bar.get(0));
		filterAdresses(bar.val());
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
function addAddress(addressObject) {
	addresses.splice(locationOf(addressObject, addresses) + 1, 0, addressObject);
}

// Address creation
$('#create-address').click(function() {
	tooltip('Creating...', this);
	IPCRenderer.sendToHost('api-call', {
		url: '/wallet/address',
	}, 'new-address');
});

// Add the new address and show it
addResultListener('new-address', function(result) {
	notify('New address created', 'created');
	addAddress(result);
	$('#search-bar').val(result.address);
	performSearch();
});

