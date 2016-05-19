import { SIAD_ERROR, WALLET_UNLOCK_ERROR } from '../constants/error.js';

export const siadError = (err) => ({
	type: SIAD_ERROR,
	err,
});
export const walletUnlockError = (err) => ({
	type: WALLET_UNLOCK_ERROR,
	err,
});
