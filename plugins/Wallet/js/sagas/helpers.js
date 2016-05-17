// async helper functions for interacting with Siad.

export const getSiadWallet = (Siad) => new Promise((resolve, reject) => {
	Siad.call('/wallet', (err, response) => {
		if (err) {
			reject(err);
		} else {
			resolve(response);
		}
	});
});
