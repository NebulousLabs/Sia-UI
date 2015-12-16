'use strict';

/*
 * hostMath module:
 *   Used by the host module to manipulate host property values.
 *   Strongly coupled with hostProperties.js
 */

// Library for arbitrary precision in numbers
const BigNumber = require('bignumber.js');
// Ensure precision
BigNumber.config({ DECIMAL_PLACES: 24 });
BigNumber.config({ EXPONENTIAL_AT: 1e+9 });
// Display # of decimals
const DISPLAY_DECIMALS = 2;

// Convert property value to human readable unit
function convertProperty(prop) {
	if (!prop.conversion) {
		return prop.value;
	}
	var converted = new BigNumber(prop.value).div(prop.conversion);
	return converted.round(DISPLAY_DECIMALS).toString();
}

// Format to standard unit
function formatProperty(prop) {
	var formatted = convertProperty(prop) + ' ' + prop.unit;
	return formatted;
}

// Revert to base unit, used when saving
function revertToBaseUnit(value, conversion) {
	if (!conversion) {
		return value;
	}
	var reverted = new BigNumber(value).times(conversion);
	return reverted.round().toString();
}

// Format to Siacoin representation with 3 or less digits
function formatSiacoin(hastings) {
	hastings = new BigNumber(hastings);
	if (hastings.isZero()) {
		return '0 S';
	}
	var k = 1000;
	var units = ['yS', 'zS', 'aS', 'fS', 'pS', 'nS', '&muS', 'mS', 'S', 'kS', 'MS'];
	var i = Math.floor((Math.log(hastings) + 1) / Math.log(k));
	var number = new BigNumber(hastings).div(Math.pow(k, i)).round(DISPLAY_DECIMALS);
	return number + " " + units[i];
}

// Format to data size representation with 3 or less digits
function formatByte(bytes) {
	bytes = new BigNumber(bytes);
	if (bytes.isZero()) {
		return '0 B';
	}
	var k = 1000;
	var units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	var i = Math.floor((Math.log(bytes) + 1) / Math.log(k));
	var number = new BigNumber(bytes).div(Math.pow(k, i)).round(DISPLAY_DECIMALS);
	return number + " " + units[i];
}

// Expose these functions to requiring objects
module.exports = {
	convertProperty: convertProperty,
	formatProperty: formatProperty,
	revertToBaseUnit: revertToBaseUnit,
	formatSiacoin: formatSiacoin,
	formatByte: formatByte,
};
