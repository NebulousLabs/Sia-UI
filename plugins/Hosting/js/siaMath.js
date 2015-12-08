'use strict';

// Library for arbitrary precision in numbers
const BigNumber = require('bignumber.js');
// Ensure precision
BigNumber.config({ DECIMAL_PLACES: 24 });
BigNumber.config({ EXPONENTIAL_AT: 1e+9 });
// Display # of decimals
const DISPLAY_DECIMALS = 2;

// Catch if BigNumber, property object, or anything else is passed in
function interpret(thing) {
	if (typeof thing === 'object') {
		thing = thing.value;
	}
	return new BigNumber(thing).toNumber();
}

// Convert to human readable unit
function convert(prop) {
	if (!prop.conversion) {
		return prop.value;
	}
	var converted = new BigNumber(prop.value).div(prop.conversion);
	return converted.round(DISPLAY_DECIMALS).toString();
}

// Functions to manipulate host property values. Strongly coupled with hostData.js
module.exports = {
	convert: convert,
	// Format to standard unit
	format: function(prop) {
		var formatted = convert(prop) + ' ' + prop.unit;
		return formatted;
	},
	// Revert to base unit, used when saving
	revert: function(value, conversion) {
		if (!conversion) {
			return value;
		}
		var reverted = new BigNumber(value).times(conversion);
		return reverted.round().toString();
	},
	// Format to Siacoin representation
	formatSiacoin: function(hastings) {
		hastings = interpret(hastings);
		if (hastings === 0) {
			return '0 S';
		}
		var k = 1000;
		var units = ['yS', 'zS', 'aS', 'fS', 'pS', 'nS', '&muS', 'mS', 'S', 'kS', 'MS'];
		var i = Math.floor((Math.log(hastings) + 1) / Math.log(k));
		var number = new BigNumber(hastings).div(Math.pow(k, i)).round(DISPLAY_DECIMALS);
		return number + " " + units[i];
	},
	// Controls data size representation
	formatByte: function(bytes) {
		bytes = interpret(bytes);
		if (bytes === 0) {
			return '0 B';
		}
		var k = 1000;
		var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		var i = Math.floor((Math.log(bytes) + 1) / Math.log(k));
		var number = new BigNumber(bytes).div(Math.pow(k, i)).round(DISPLAY_DECIMALS);
		return number + " " + units[i];
	},
};
