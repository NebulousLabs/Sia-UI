import * as constants from '../constants/constants.js'

export const updateSetting = (setting, value) => ({
	type: constants.UPDATE_SETTING,
	setting,
	value,
})

export const updateModal = (key, value) => ({
	type: constants.UPDATE_MODAL,
	key,
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

export const addFolderAskPathSize = (folder) => ({
	type: constants.ADD_FOLDER_ASK,
})

export const removeFolder = (folder) => ({
	type: constants.REMOVE_FOLDER,
	folder,
})

export const resizeFolder = (folder) => ({
	type: constants.RESIZE_FOLDER,
	folder,
})

export const showResizeDialog = (folder) => ({
	type: constants.SHOW_RESIZE_DIALOG,
	folder,
})

export const hideResizeDialog = (folder) => ({
	type: constants.HIDE_RESIZE_DIALOG,
	folder,
})
