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
export const createNewWallet = (password, seed) => ({
	type: constants.CREATE_NEW_WALLET,
	password,
	seed,
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
export const startSendPrompt = (currencytype) => ({
	type: constants.START_SEND_PROMPT,
	currencytype,
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
export const sendCurrency = (destination, amount, currencytype) => ({
	type: constants.SEND_CURRENCY,
	destination,
	amount,
	currencytype,
})
export const closePasswordPrompt = () => ({
	type: constants.CLOSE_PASSWORD_PROMPT,
})
export const handlePasswordChange = (password) => ({
	type: constants.HANDLE_PASSWORD_CHANGE,
	password,
})
export const lockWallet = () => ({
	type: constants.LOCK_WALLET,
})
export const showConfirmationDialog = () => ({
	type: constants.SHOW_CONFIRMATION_DIALOG,
})
export const hideConfirmationDialog = () => ({
	type: constants.HIDE_CONFIRMATION_DIALOG,
})
export const showMoreTransactions = (increment = 30) => ({
	type: constants.SHOW_MORE_TRANSACTIONS,
	increment,
})
export const getSyncState = () => ({
	type: constants.GET_SYNCSTATE,
})
export const setSyncState = (synced) => ({
	type: constants.SET_SYNCSTATE,
	synced,
})
export const showNewWalletForm = () => ({
	type: constants.SHOW_NEW_WALLET_FORM,
})
export const hideNewWalletForm = () => ({
	type: constants.HIDE_NEW_WALLET_FORM,
})
export const setUseCustomPassphrase = (useCustomPassphrase) => ({
	type: constants.SET_USE_CUSTOM_PASSPHRASE,
	useCustomPassphrase,
})
export const showSeedRecoveryDialog = () => ({
	type: constants.SHOW_SEED_RECOVERY_DIALOG,
})
export const hideSeedRecoveryDialog = () => ({
	type: constants.HIDE_SEED_RECOVERY_DIALOG,
})
export const recoverSeed = (seed) => ({
	type: constants.RECOVER_SEED,
	seed,
})
export const seedRecoveryStarted = () => ({
	type: constants.SEED_RECOVERY_STARTED,
})
export const seedRecoveryFinished = () => ({
	type: constants.SEED_RECOVERY_FINISHED,
})
export const showInitSeedForm = () => ({
	type: constants.SHOW_INIT_SEED_FORM,
})
export const hideInitSeedForm = () => ({
	type: constants.HIDE_INIT_SEED_FORM,
})
export const initSeedStarted = () => ({
	type: constants.SEED_INIT_STARTED,
})
export const initSeedFinished = () => ({
	type: constants.SEED_INIT_FINISHED,
})
export const setRescanning = (rescanning) => ({
	type: constants.SET_RESCANNING,
	rescanning,
})
export const setConfirmationError = (error) => ({
	type: constants.SET_CONFIRMATION_ERROR,
	error,
})
export const showChangePasswordDialog = () => ({
	type: constants.SHOW_CHANGE_PASSWORD_DIALOG,
})
export const hideChangePasswordDialog = () => ({
	type: constants.HIDE_CHANGE_PASSWORD_DIALOG,
})
export const changePassword = (currentpassword, newpassword) => ({
	type: constants.CHANGE_PASSWORD,
	currentpassword,
	newpassword,
})
export const setChangePasswordError = (error) => ({
	type: constants.SET_CHANGE_PASSWORD_ERROR,
	error,
})
