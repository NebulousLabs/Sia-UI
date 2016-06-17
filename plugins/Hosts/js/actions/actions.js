import * as constants from '../constants/constants.js'

export const updateSetting = (setting, value) => ({
	type: constants.UPDATE_SETTING,
	setting,
	value,
})

export const updateSettings = (settings, acceptingContracts) => ({
	type: constants.UPDATE_SETTINGS,
	settings,
})

export const fetchSettings = () => ({
	type: constants.FETCH_SETTINGS,
})

export const updateSettingsSuccess = (settings, acceptingContracts) => ({
	type: constants.UPDATE_SETTINGS_SUCCESS,
	settings,
})

export const toggleAcceptingContracts = () => ({
	type: constants.TOGGLE_ACCEPTING,
})

export const resetHost = () => ({
	type: constants.RESET_HOST,
})
