import { Map, Set, OrderedSet, List } from 'immutable'
import * as constants from '../constants/files.js'
import { ls, searchFiles, rangeSelect } from '../sagas/helpers.js'

const initialState = Map({
	files: List(),
	workingDirectoryFiles: null,
	searchResults: List(),
	uploading: List(),
	downloading: List(),
	selected: OrderedSet(),
	path: '',
	searchText: '',
	uploadSource: '',
	showAllowanceDialog: false,
	showUploadDialog: false,
	showSearchField: false,
	showFileTransfers: false,
	showDeleteDialog: false,
	showRenameDialog: false,
	settingAllowance: false,
	dragging: false,
	contractCount: 0,
	allowance: '0',
	spending: '0',
	showDownloadsSince: Date.now(),
	unreadUploads: Set(),
	unreadDownloads: Set(),
})

export default function filesReducer(state = initialState, action) {
	switch (action.type) {
	case constants.SET_ALLOWANCE_COMPLETED:
		return state.set('settingAllowance', false)
	case constants.RECEIVE_ALLOWANCE:
		return state.set('allowance', action.allowance)
	case constants.RECEIVE_SPENDING:
		return state.set('spending', action.spending)
	case constants.DOWNLOAD_FILE:
		return state.set('unreadDownloads', state.get('unreadDownloads').add(action.file.siapath))
	case constants.UPLOAD_FILE:
		return state.set('unreadUploads', state.get('unreadUploads').add(action.siapath))
	case constants.RECEIVE_FILES: {
		const workingDirectoryFiles = ls(action.files, state.get('path'))
		const workingDirectorySiapaths = workingDirectoryFiles.map((file) => file.siapath)
		// filter out selected files that are no longer in the working directory
		const selected = state.get('selected').filter((file) => workingDirectorySiapaths.includes(file.siapath))
		return state.set('files', action.files)
		            .set('workingDirectoryFiles', workingDirectoryFiles)
		            .set('selected', selected)
	}
	case constants.SET_ALLOWANCE:
		return state.set('allowance', action.funds)
		            .set('settingAllowance', true)
	case constants.CLEAR_DOWNLOADS:
		return state.set('showDownloadsSince', Date.now())
	case constants.SET_SEARCH_TEXT: {
		const results = searchFiles(state.get('workingDirectoryFiles'), action.text, state.get('path'))
		return state.set('searchResults', results)
		            .set('searchText', action.text)
	}
	case constants.SET_PATH:
		return state.set('path', action.path)
		            .set('selected', OrderedSet())
		            .set('workingDirectoryFiles', ls(state.get('files'), action.path))
		            .set('searchResults', searchFiles(state.get('workingDirectoryFiles'), state.get('searchText', state.get('path'))))
	case constants.DESELECT_FILE:
		return state.set('selected', state.get('selected').filter((file) => file.siapath !== action.file.siapath))
	case constants.SELECT_FILE:
		return state.set('selected', state.get('selected').add(action.file))
	case constants.DESELECT_ALL:
		return state.set('selected', OrderedSet())
	case constants.SELECT_UP_TO:
		return state.set('selected', rangeSelect(action.file, state.get('workingDirectoryFiles'), state.get('selected')))
	case constants.SHOW_ALLOWANCE_DIALOG:
		return state.set('showAllowanceDialog', true)
	case constants.CLOSE_ALLOWANCE_DIALOG:
		return state.set('showAllowanceDialog', false)
	case constants.TOGGLE_SEARCH_FIELD:
		return state.set('showSearchField', !state.get('showSearchField'))
	case constants.SET_DRAGGING:
		return state.set('dragging', true)
	case constants.SET_NOT_DRAGGING:
		return state.set('dragging', false)
	case constants.SHOW_DELETE_DIALOG:
		return state.set('showDeleteDialog', true)
	case constants.HIDE_DELETE_DIALOG:
		return state.set('showDeleteDialog', false)
	case constants.SHOW_UPLOAD_DIALOG:
		return state.set('showUploadDialog', true)
		            .set('uploadSource', action.source)
	case constants.HIDE_UPLOAD_DIALOG:
		return state.set('showUploadDialog', false)
	case constants.RECEIVE_UPLOADS:
		return state.set('uploading', action.uploads)
	case constants.RECEIVE_DOWNLOADS:
		return state.set('downloading', action.downloads.filter((download) => Date.parse(download.starttime) > state.get('showDownloadsSince')))
	case constants.SHOW_FILE_TRANSFERS:
		return state.set('showFileTransfers', true)
	case constants.HIDE_FILE_TRANSFERS:
		return state.set('showFileTransfers', false)
	case constants.TOGGLE_FILE_TRANSFERS:
		return state.set('showFileTransfers', !state.get('showFileTransfers'))
		            .set('unreadDownloads', Set())
		            .set('unreadUploads', Set())
	case constants.SET_CONTRACT_COUNT:
		return state.set('contractCount', action.count)
	case constants.SHOW_RENAME_DIALOG:
		return state.set('showRenameDialog', true)
	case constants.HIDE_RENAME_DIALOG:
		return state.set('showRenameDialog', false)
	default:
		return state
	}
}
