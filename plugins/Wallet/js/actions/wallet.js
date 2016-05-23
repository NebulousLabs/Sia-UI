// wallet.js: Actions dispatched to the wallet redux store.

import * as constants from '../constants/wallet.js';

export const getLockStatus = () => ({
	type: constants.GET_LOCK_STATUS,
});
export const setLocked = () => ({
	type: constants.SET_LOCKED,
});
export const setUnlocked = () => ({
	type: constants.SET_UNLOCKED,
});
export const setEncrypted = () => ({
	type: constants.SET_ENCRYPTED,
});
export const setUnencrypted = () => ({
	type: constants.SET_UNENCRYPTED,
});
export const startPasswordPrompt = () => ({
	type: constants.START_PASSWORD_PROMPT,
});
export const dismissNewWalletDialog = () => ({
	type: constants.DISMISS_NEW_WALLET_DIALOG,
});
export const showNewWalletDialog = (password, seed) => ({
	type: constants.SHOW_NEW_WALLET_DIALOG,
	password,
	seed
});
export const unlockWallet = (password) => ({
	type: constants.UNLOCK_WALLET,
	password,
});
export const createNewWallet = () => ({
	type: constants.CREATE_NEW_WALLET,
});
export const getBalance = () => ({
	type: constants.GET_BALANCE,
});
export const setBalance = (confirmed, unconfirmed) => ({
	type: constants.SET_BALANCE,
	confirmed,
	unconfirmed,
});
export const getAddresses = () => ({
	type: constants.GET_ADDRESSES,
});
export const setAddresses = (addresses) => ({
	type: constants.SET_ADDRESSES,
	addresses,
});
export const getTransactions = () => ({
	type: constants.GET_TRANSACTIONS,
});
export const setTransactions = (transactions) => ({
	type: constants.SET_TRANSACTIONS,
	transactions,
});
