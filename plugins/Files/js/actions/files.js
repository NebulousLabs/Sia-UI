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
export const setAllowanceCompleted = () => ({
	type: constants.SET_ALLOWANCE_COMPLETED,
})
export const setAllowance = (funds) => ({
	type: constants.SET_ALLOWANCE,
	funds,
})
export const getWalletBalance = () => ({
	type: constants.GET_WALLET_BALANCE,
})
export const receiveWalletBalance = (balance) => ({
	type: constants.RECEIVE_WALLET_BALANCE,
	balance,
})
export const showAllowanceDialog = () => ({
	type: constants.SHOW_ALLOWANCE_DIALOG,
})
export const closeAllowanceDialog = () => ({
	type: constants.CLOSE_ALLOWANCE_DIALOG,
})
export const calculateStorageCost = (size) => ({
	type: constants.CALCULATE_STORAGE_COST,
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
export const uploadFile = (siapath, source) => ({
	type: constants.UPLOAD_FILE,
	siapath,
	source,
})
export const deleteFile = (siapath) => ({
	type: constants.DELETE_FILE,
	siapath,
})
export const uploadFolder = (siapath, source) => ({
	type: constants.UPLOAD_FOLDER,
	siapath,
	source,
})
export const getDownloads = (since) => ({
	type: constants.GET_DOWNLOADS,
	since,
})
export const getUploads = () => ({
	type: constants.GET_UPLOADS,
})
export const receiveUploads = (uploads) => ({
	type: constants.RECEIVE_UPLOADS,
	uploads,
})
export const receiveDownloads = (downloads) => ({
	type: constants.RECEIVE_DOWNLOADS,
	downloads,
})
export const showFileTransfers = () => ({
	type: constants.SHOW_FILE_TRANSFERS,
})
export const hideFileTransfers = () => ({
	type: constants.HIDE_FILE_TRANSFERS,
})
export const toggleFileTransfers = () => ({
	type: constants.TOGGLE_FILE_TRANSFERS,
})
export const showDeleteDialog = (siapath) => ({
	type: constants.SHOW_DELETE_DIALOG,
	siapath,
})
export const hideDeleteDialog = () => ({
	type: constants.HIDE_DELETE_DIALOG,
})
export const receiveDiskUsage = (usage) => ({
	type: constants.RECEIVE_DISK_USAGE,
	usage,
})
export const openDownloadLocation = (location) => ({
	type: constants.OPEN_DOWNLOAD_LOCATION,
	location,
})
