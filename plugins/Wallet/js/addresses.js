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
		<div class='entry s-font' id=''>
			<div class='listnum'></div>
			<div class='button address cssTooltip' tooltip-content='Show Related Transactions'>
				<i class='fa fa-search fa-flip-horizontal'></i>
			</div>
			<div class='button copy-address'>
				<i class='fa fa-clipboard'></i>
			</div>
		</div>
	`);
	element.attr('id', address);
	element.find('.listnum').text(number);
	element.find('.address').append(address);

	// Make clicking this address show relevant transactions
	element.find('.address').click(function(event) {
		updateTransactionCriteria({
			address: event.target.id,
		});
	});

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
	// TODO: Merge itemsPerPage into Transaction's filter criteria and make an overall
	// settings object, perhaps just as a member of the `wallet` object
	var itemsPerPage = 25;
	$('#address-list').empty();

	// Determine if search or normal page 
	var array = $('#address-search-bar').val() ? searchedAddresses : addresses;
	var maxPage = array.length === 0 ? 1 : Math.ceil(array.length / itemsPerPage);
	$('#address-page').attr({
		min: 1,
		max: maxPage,
	});
	$('#address-page').next().text(' / ' + maxPage);

	// Enforce page limits
	if ($('#address-page').val() > maxPage) {
		$('#address-page').val(maxPage);
	}
	if ($('#address-page').val() < 1	) {
		$('#address-page').val(1);
	}

	// Make elements for this page
	var n = (($('#address-page').val() - 1) * itemsPerPage);
	array.slice(n, n + itemsPerPage).forEach(function(addr, index) {
		// If searching, the array will contain objects instead of strings
		var number = addr.number || n + index + 1;
		var address = addr.address || addr;
		makeAddress(address, number);
	});
}

// Retrieves address list from siad
function getAddresses() {
	Siad.apiCall({
		url: '/wallet/addresses',
		type: 'GET',
	}, function(result) {
		addresses = result.addresses;
		updateAddressPage();
	});
}

// Update addresses on page navigation
$('#address-page').on('input', updateAddressPage);

// Refresh button
$('#view-all-addresses').click(function() {
	$('#address-search-bar').val('');
	getAddresses();
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Search ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Filter address list by search string
function filterAdresses(searchstr) {
	// Filter
	searchedAddresses = addresses.map(address => ({address: address}));
	searchedAddresses = addresses.filter(function(addressObject) {
		return (addressObject.includes(searchstr));
	});
}

// Show addresses based on search bar string
function performSearch() {
	var searchString = $('#address-search-bar').val();

	// Don't search an empty string
	if (searchString.length !== 0) {
		filterAdresses(searchString);
	}
	
	// Reset page number and update
	$('#address-page').val(1);
	updateAddressPage();
}

// Start search when typing in Search field
$('#address-search-bar').on('input', function() {
	tooltip('Searching...', this);
	performSearch();
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ New Address ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Find location of address in addresses array
function locationOf(element, array, start, end) {
	start = start || 0;
	end = end || array.length;
	var pivot = parseInt(start + (end - start) / 2, 10);
	if (array[pivot] === element) {
		return pivot;
	} else if (end - start <= 1) {
		return array[pivot] > element ? pivot - 1 : pivot;
	} else if (array[pivot] < element) {
		return locationOf(element, array, pivot, end);
	} else {
		return locationOf(element, array, start, pivot);
	}
}

// Insert address into the sorted array
function addAddress(address) {
	addresses.splice(locationOf(address, addresses) + 1, 0, address);
}

// Address creation
$('#create-address').click(function() {
	tooltip('Creating...', this);
	Siad.apiCall({
		url: '/wallet/address',
	}, function(result) {
		notify('New address created', 'created');
		addAddress(result.address);
		
		// Display only the created address
		$('#address-search-bar').val(result.address);
		performSearch();
	});
});
