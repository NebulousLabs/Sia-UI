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

export const fetchData = () => ({
	type: constants.FETCH_DATA,
})

export const fetchDataSuccess = (data) => ({
	type: constants.FETCH_DATA_SUCCESS,
	data,
})

export const toggleAcceptingContracts = () => ({
	type: constants.TOGGLE_ACCEPTING,
})

export const resetHost = () => ({
	type: constants.RESET_HOST,
})

export const addFolder = (folder) => ({
	type: constants.ADD_FOLDER,
	folder,
})

export const deleteFolder = (folder) => ({
	type: constants.RESET_HOST,
	folder,
})

export const resizeFolder = (folder) => ({
	type: constants.RESET_HOST,
	folder,
})
