import * as constants from '../constants/constants.js'

export const updateSetting = (setting, value) => ({
	type: constants.UPDATE_SETTING,
	setting,
	value,
})

export const updateSettings = (settings, acceptingContracts) => ({
	type: constants.UPDATE_SETTINGS,
	settings,
	acceptingContracts,
})

export const toggleAcceptingContracts = () => ({
	type: constants.TOGGLE_ACCEPTING,
})

export const resetHost = () => ({
	type: constants.RESET_HOST,
})
