import * as constants from '../constants/files.js'

export const getFiles = () => ({
	type: constants.GET_FILES,
})
export const receiveFiles = (files) => ({
	type: constants.RECEIVE_FILES,
	files,
})
export const receiveFileDetail = (detail) => ({
	type: constants.RECEIVE_FILE_DETAIL,
	...detail,
})
export const fetchData = () => ({
	type: constants.FETCH_DATA,
})
export const showFileDetail = (siapath) => ({
	type: constants.SHOW_FILE_DETAIL,
	siapath
})
export const closeFileDetail = () => ({
	type: constants.CLOSE_FILE_DETAIL,
})
export const fetchFileDetail = (siapath, pagingNum, current) => ({
	type: constants.GET_FILE_DETAIL,
	siapath,
	pagingNum,
	current,
})
export const setDragFolderTarget = (target) => ({
	type: constants.SET_DRAG_FOLDER_TARGET,
	target,
})
