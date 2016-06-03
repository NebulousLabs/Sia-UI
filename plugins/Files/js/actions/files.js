import * as constants from '../constants/files.js'

export const getWalletLocked = () => ({
	type: constants.GET_WALLET_LOCKED,
})
export const setWalletLocked = (locked) => ({
	type: constants.SET_WALLET_LOCKED,
	locked,
})
