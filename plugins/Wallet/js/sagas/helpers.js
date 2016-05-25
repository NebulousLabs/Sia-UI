// Helper functions for the wallet plugin.  Mostly used in sagas.
import BigNumber from 'bignumber.js';
import { List } from 'immutable';
import Siad from 'sia.js';
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
		value: Siad.hastingsToSiacoins(value),
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
			currency,
			value: value.round(4).toString(),
			transactionid: rawTransactions[i].transactionid,
			confirmationtimestamp: rawTransactions[i].confirmationtimestamp,
		})
	}
	// Return the transactions, sorted by timestamp.
	// See https://facebook.github.io/immutable-js/docs/#/Iterable/sort for more on how this works.
	return parsedTransactions.sort((t1, t2) => {
		if (t1.confirmationtimestamp > t2.confirmationtimestamp) {
			return -1;
		}
		return 1;
	});
}
