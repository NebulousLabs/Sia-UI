import * as constants from '../constants/files.js'

export const getWalletLockstate = () => ({
	type: constants.GET_WALLET_LOCKSTATE,
})
export const receiveWalletLockstate = (unlocked) => ({
	type: constants.RECEIVE_WALLET_LOCKSTATE,
	unlocked,
})
export const getFiles = (path) => ({
	type: constants.GET_FILES,
	path,
})
export const receiveFiles = (files, path) => ({
	type: constants.RECEIVE_FILES,
	files,
	path,
})
export const getAllowance = () => ({
	type: constants.GET_ALLOWANCE,
})
export const setAllowanceCompleted = () => ({
	type: constants.SET_ALLOWANCE_COMPLETED,
})
export const setAllowance = (funds) => ({
	type: constants.SET_ALLOWANCE,
	funds,
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
export const handleStorageSizeChange = (size) => ({
	type: constants.HANDLE_STORAGE_SIZE_CHANGE,
	size,
})
export const setStorageCost = (cost) => ({
	type: constants.SET_STORAGE_COST,
	cost,
})
export const setStorageSize = (size) => ({
	type: constants.SET_STORAGE_SIZE,
	size,
})
export const setAllowanceProgress = (progress) => ({
	type: constants.SET_ALLOWANCE_PROGRESS,
	progress,
})
export const setPath = (path) => ({
	type: constants.SET_PATH,
	path,
})
export const setSearchText = (text, path) => ({
	type: constants.SET_SEARCH_TEXT,
	text,
	path,
})
export const toggleSearchField = () => ({
	type: constants.TOGGLE_SEARCH_FIELD,
})
export const setDragging = () => ({
	type: constants.SET_DRAGGING,
})
export const setNotDragging = () => ({
	type: constants.SET_NOT_DRAGGING,
})
export const showUploadDialog = (source) => ({
	type: constants.SHOW_UPLOAD_DIALOG,
	source,
})
export const hideUploadDialog = () => ({
	type: constants.HIDE_UPLOAD_DIALOG,
})
export const downloadFile = (siapath, downloadpath) => ({
	type: constants.DOWNLOAD_FILE,
	siapath,
	downloadpath,
})
export const addFileToDownloads = (file) => ({
	type: constants.ADD_FILE_TO_DOWNLOADS,
	file,
})
export const showFileView = (file) => ({
	type: constants.SHOW_FILE_VIEW,
	file,
})
export const hideFileView = () => ({
	type: constants.HIDE_FILE_VIEW,
})
export const getDownloads = (since) => ({
	type: constants.GET_DOWNLOADS,
	since,
})
export const addDownload = (download) => ({
	type: constants.ADD_DOWNLOAD,
	download,
})
export const removeDownload = (siapath) => ({
	type: constants.REMOVE_DOWNLOAD,
	siapath,
})
export const toggleDownloadList = () => ({
	type: constants.TOGGLE_DOWNLOADS_LIST,
})
