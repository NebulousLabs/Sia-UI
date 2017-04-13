import * as constants from '../constants/constants.js'

export const updateDefaultSettings = (newvalue) => ({
	type: constants.UPDATE_DEFAULT_SETTINGS,
	newvalue,
})

export const updateModal = (key, value) => ({
	type: constants.UPDATE_MODAL,
	key,
	value,
})

export const updateSettings = (settings) => ({
	type: constants.UPDATE_SETTINGS,
	settings,
})

export const pushSettings = (settings) => ({
	type: constants.PUSH_SETTINGS,
	settings,
})

export const fetchData = (ignoreSettings) => ({
	type: constants.FETCH_DATA,
	ignoreSettings,
})

export const fetchDataSuccess = (data, settings, modals) => ({
	type: constants.FETCH_DATA_SUCCESS,
	data,
	settings,
	modals,
})

export const showToggleAcceptingModal = () => ({
	type: constants.SHOW_TOGGLE_ACCEPTING_MODAL,
})

export const hideToggleAcceptingModal = () => ({
	type: constants.HIDE_TOGGLE_ACCEPTING_MODAL,
})

export const resetHost = () => ({
	type: constants.RESET_HOST,
})

export const addFolder = (folder) => ({
	type: constants.ADD_FOLDER,
	folder,
})

export const addFolderAskPathSize = () => ({
	type: constants.ADD_FOLDER_ASK,
})

export const updateFolderToRemove = (folder) => ({
	type: constants.UPDATE_FOLDER_TO_REMOVE,
	folder,
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

export const requestDefaultSettings = () => ({
	type: constants.REQUEST_DEFAULT_SETTINGS,
})

export const receiveDefaultSettings = (settings) => ({
	type: constants.RECEIVE_DEFAULT_SETTINGS,
	settings,
})

export const getHostStatus = () => ({
	type: constants.GET_HOST_STATUS,
})

export const setHostStatus = (connectable, working) => ({
	type: constants.SET_HOST_STATUS,
	connectable,
	working,
})

