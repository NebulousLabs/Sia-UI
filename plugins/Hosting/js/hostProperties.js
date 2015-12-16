'use strict';

/*
 * hostProperties module:
 *   Holds data and/or conversion information about each hosting property.
 *   Strongly coupled with hostMath.js
 */

// Library for arbitrary precision in numbers
const BigNumber = require('bignumber.js');
// Ensure precision
BigNumber.config({ DECIMAL_PLACES: 24 });
BigNumber.config({ EXPONENTIAL_AT: 1e+9 });

// Units
// Bytes per GB
const B_per_GB = new BigNumber('1e+9');
// Hastings per Siacoin
const H_per_S = new BigNumber('1e+24');
// Blocks per Hour
const BLOCKS_per_HOUR = new BigNumber(6);
// Blocks per Day
const BLOCKS_per_DAY = BLOCKS_per_HOUR.times(24);
// Blocks per 30-day Month
const BLOCKS_per_MONTH = BLOCKS_per_DAY.times(30);
// Hastings per Siacoin (1e24) / B per GB (1e9) / Blocks per 30-day month (4320)
const MONTHLY_DATA_COST = H_per_S.div(B_per_GB).div(BLOCKS_per_MONTH);

// Exports organized information about all the host status properties
var props = {
	collateral: {
		descr: 'Collateral',
		unit: 'S/GB/month',
		conversion: MONTHLY_DATA_COST,
	},
	ipaddress: {
		descr: 'Network Address',
		unit: 'IP Address',
	},
	maxduration: {
		descr: 'Maximum Duration',
		unit: 'Days',
		conversion: BLOCKS_per_DAY,
	},
	minduration: {
		descr: 'Minimum Duration',
		unit: 'Days',
		conversion: BLOCKS_per_DAY,
	},
	price: {
		descr: 'Price',
		unit: 'S/GB/month',
		conversion: MONTHLY_DATA_COST,
	},
	totalstorage: {
		descr: 'Total Storage',
		unit: 'GB',
		conversion: B_per_GB,
	},
	storageremaining: {
		descr: 'Total Storage',
		unit: 'GB',
		conversion: B_per_GB,
	},
	unlockhash: {
		descr: 'Payout Address',
		unit: 'Hex',
	},
	windowsize: {
		descr: 'Time Window for Storage Proof',
		unit: 'Hours',
		conversion: BLOCKS_per_HOUR,
	},
	numcontracts: {
		descr: 'Number of File Contracts',
		unit: 'Contracts',
	},
	revenue: {
		descr: 'Revenue Earned',
		unit: 'S',
		conversion: H_per_S,
	},
	upcomingrevenue: {
		descr: 'Revenue to be Earned',
		unit: 'S',
		conversion: H_per_S,
	},
};

module.exports = props;
