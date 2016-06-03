import * as constants from '../constants/files.js'

export const getWalletLockstate = () => ({
	type: constants.GET_WALLET_LOCKSTATE,
})
export const setWalletLockstate = (unlocked) => ({
	type: constants.SET_WALLET_LOCKSTATE,
	unlocked,
})
export const getFiles = () => ({
	type: constants.GET_FILES,
})
export const setFiles = (files) => ({
	type: constants.SET_FILES,
	files,
})
export const getAllowance = () => ({
	type: constants.GET_ALLOWANCE,
})
export const receiveAllowance = (allowance) => ({
	type: constants.RECEIVE_ALLOWANCE,
	allowance,
})
export const setAllowance = (allowance) => ({
	type: constants.SET_ALLOWANCE,
	allowance,
})
