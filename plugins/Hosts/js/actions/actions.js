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

export const fetchData = (ignoreSettings) => ({
	type: constants.FETCH_DATA,
	ignoreSettings,
})

export const fetchDataSuccess = (data, ignoreSettings) => ({
	type: constants.FETCH_DATA_SUCCESS,
	data,
	ignoreSettings,
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

export const resizeFolder = (folder, ignoreInitial) => ({
	type: constants.RESIZE_FOLDER,
	folder,
	ignoreInitial,
})

export const showResizeDialog = (folder, ignoreInitial) => ({
	type: constants.SHOW_RESIZE_DIALOG,
	folder,
	ignoreInitial,
})

export const hideResizeDialog = (folder) => ({
	type: constants.HIDE_RESIZE_DIALOG,
	folder,
})

export const announceHost = (address) => ({
	type: constants.ANNOUNCE_HOST,
	address,
})

export const showAnnounceDialog = (address) => ({
	type: constants.SHOW_ANNOUNCE_DIALOG,
	address,
})

export const hideAnnounceDialog = (address) => ({
	type: constants.HIDE_ANNOUNCE_DIALOG,
	address,
})

export const showWarning = (modal, acceptAction, declineAction) => ({
	type: constants.SHOW_WARNING,
	modal, // { title: "", message: "" }
	acceptAction,
	declineAction,
})

export const showWarningModal = (modal) => ({
	type: constants.SHOW_WARNING_MODAL,
	modal, // { title: "", message: "" }
})

export const hideWarningModal = (accepted) => ({
	type: constants.HIDE_WARNING_MODAL,
	accepted,
})
