// Helper functions for the wallet plugin.  Mostly used in sagas.
import BigNumber from 'bignumber.js';

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
