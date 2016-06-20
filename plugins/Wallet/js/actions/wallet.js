import * as constants from '../constants/wallet.js'

export const getLockStatus = () => ({
	type: constants.GET_LOCK_STATUS,
})
export const setLocked = () => ({
	type: constants.SET_LOCKED,
})
export const setUnlocked = () => ({
	type: constants.SET_UNLOCKED,
})
export const setEncrypted = () => ({
	type: constants.SET_ENCRYPTED,
})
export const setUnencrypted = () => ({
	type: constants.SET_UNENCRYPTED,
})
export const dismissNewWalletDialog = () => ({
	type: constants.DISMISS_NEW_WALLET_DIALOG,
})
export const showNewWalletDialog = (password, seed) => ({
	type: constants.SHOW_NEW_WALLET_DIALOG,
	password,
	seed,
})
export const unlockWallet = (password) => ({
	type: constants.UNLOCK_WALLET,
	password,
})
export const createNewWallet = () => ({
	type: constants.CREATE_NEW_WALLET,
})
export const getBalance = () => ({
	type: constants.GET_BALANCE,
})
export const setBalance = (confirmed, unconfirmed, siafunds) => ({
	type: constants.SET_BALANCE,
	confirmed,
	unconfirmed,
	siafunds,
})
export const getTransactions = () => ({
	type: constants.GET_TRANSACTIONS,
})
export const setTransactions = (transactions) => ({
	type: constants.SET_TRANSACTIONS,
	transactions,
})
export const startSendPrompt = () => ({
	type: constants.START_SEND_PROMPT,
})
export const closeSendPrompt = () => ({
	type: constants.CLOSE_SEND_PROMPT,
})
export const setSendAddress = (address) => ({
	type: constants.SET_SEND_ADDRESS,
	address,
})
export const setSendAmount = (amount) => ({
	type: constants.SET_SEND_AMOUNT,
	amount,
})
export const showReceivePrompt = () => ({
	type: constants.SHOW_RECEIVE_PROMPT,
})
export const hideReceivePrompt = () => ({
	type: constants.HIDE_RECEIVE_PROMPT,
})
export const getNewReceiveAddress = () => ({
	type: constants.GET_NEW_RECEIVE_ADDRESS,
})
export const setReceiveAddress = (address) => ({
	type: constants.SET_RECEIVE_ADDRESS,
	address,
})
export const sendSiacoin = (destination, amount) => ({
	type: constants.SEND_SIACOIN,
	destination,
	amount,
})
export const closePasswordPrompt = () => ({
	type: constants.CLOSE_PASSWORD_PROMPT,
})
export const handlePasswordChange = (password) => ({
	type: constants.HANDLE_PASSWORD_CHANGE,
	password,
})

