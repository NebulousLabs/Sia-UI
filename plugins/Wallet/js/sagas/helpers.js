// Helper functions for the wallet plugin.  Mostly used in sagas.
import BigNumber from 'bignumber.js';
import { List } from 'immutable';
const uint64max = Math.pow(2, 64);

// siadCall: promisify Siad API calls.  Resolve the promise with `response` if the call was successful,
// otherwise reject the promise with `err`.
export const siadCall = (Siad, uri) => new Promise((resolve, reject) => {
	Siad.call(uri, (err, response) => {
		if (err) {
			reject(err);
		} else { 
			resolve(response);
		}
	})
})

// Ensure precision for hastings -> siacoin conversion
BigNumber.config({ DECIMAL_PLACES: 30 });
BigNumber.config({ EXPONENTIAL_AT: 1e+9 });

// Convert from hastings to siacoin
// TODO: Enable commas for large numbers
export const hastingsToSiacoin = (hastings) => {
	// TODO: JS automatically loses precision when taking numbers from the API.
	// This deals with that imperfectly
	var number = new BigNumber(hastings);
	var ConversionFactor = new BigNumber(10).pow(24);

	return number.gt(1) ? number.dividedBy(ConversionFactor).round(2).toNumber()
						: number.dividedBy(ConversionFactor).toPrecision(1);
}

// Compute the net value and currency type of a transaction.
const computeSum = (txn) => {
	var value = new BigNumber(0);
	var currency;
	if (txn.inputs) {
		for (let i = 0; i < txn.inputs.length; i++) {
			const input = txn.inputs[i];
			if (input.walletaddress) {
				value = value.sub(input.value);
			}
			// TODO: Imperfect way to go about determining currency of
			// transaction from 'miner', 'siacoin', or 'siafund'
			currency = input.fundtype.split(' ')[0];
		}
	}
	if (txn.outputs) {
		for (let i = 0; i < txn.outputs.length; i++) {
			const output = txn.outputs[i];
			if (output.walletaddress) {
				value = value.add(output.value);
			}
			// TODO: Imperfect way to go about determining currency of
			// transaction from 'miner', 'siacoin', or 'siafund'
			currency = output.fundtype.split(' ')[0];
		}
	}
	return {
		value: hastingsToSiacoin(value),
		currency,
	};
}

// Parse data from /wallet/transactions and return a immutable List of transaction objects.
// The transaction objects contain the following values:
// {
//   confirmed (boolean): whether this transaction has been confirmed by the network
//   currency: The type of Sia currency ('siafund' or 'siacoin')
//   value: The total value of this transaction
//   transactionid: The transaction ID
//   confirmationtimestamp:  The time at which this transaction occurred
// }
export const parseRawTransactions = (response) => {
	var parsedTransactions = List();
	if (!response.unconfirmedtransactions) {
		response.unconfirmedtransactions = [];
	}
	if (!response.confirmedtransactions) {
		response.confirmedtransactions = [];
	}
	const rawTransactions = response.unconfirmedtransactions.concat(response.confirmedtransactions);
	for (let i = 0; i < rawTransactions.length; i++ ) {
		const { value, currency } = computeSum(rawTransactions[i]);
		let confirmed = true;
		if (rawTransactions[i].confirmationtimestamp === uint64max) {
			confirmed = false;
		}
		parsedTransactions = parsedTransactions.push({
			confirmed,
			value,
			currency,
			transactionid: rawTransactions[i].transactionid,
			confirmationtimestamp: rawTransactions[i].confirmationtimestamp,
		})
	}
	return parsedTransactions;
}
