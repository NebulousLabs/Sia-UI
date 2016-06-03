import * as constants from '../constants/files.js'

export const getWalletLockstate = () => ({
	type: constants.GET_WALLET_LOCKSTATE,
})
export const setWalletLockstate = (unlocked) => ({
	type: constants.SET_WALLET_LOCKSTATE,
	unlocked,
})
