import * as constants from '../constants/files.js'

export const getWalletLockstate = () => ({
	type: constants.GET_WALLET_LOCKSTATE,
})
export const receiveWalletLockstate = (unlocked) => ({
	type: constants.RECEIVE_WALLET_LOCKSTATE,
	unlocked,
})
export const getFiles = () => ({
	type: constants.GET_FILES,
})
export const receiveFiles = (files) => ({
	type: constants.RECEIVE_FILES,
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
export const getMetrics = () => ({
	type: constants.GET_METRICS,
})
export const receiveMetrics = (activespending, allocatedspending) => ({
	type: constants.RECEIVE_METRICS,
	activespending,
	allocatedspending,
})
export const getWalletBalance = () => ({
	type: constants.GET_WALLET_BALANCE,
})
export const receiveWalletBalance = (balance) => ({
	type: cosntants.RECEIVE_WALLET_BALANCE,
	balance,
})
export const showAllowanceDialog = () => ({
	type: constants.SHOW_ALLOWANCE_DIALOG,
})
export const closeAllowanceDialog = () => ({
	type: constants.CLOSE_ALLOWANCE_DIALOG,
})
