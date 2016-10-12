import { Map, Set, List } from 'immutable'
import * as constants from '../constants/files.js'
import { ls, searchFiles } from '../sagas/helpers.js'

const initialState = Map({
	files: List(),
	workingDirectoryFiles: List(),
	searchResults: List(),
	uploading: List(),
	downloading: List(),
	selected: Set(),
	path: '',
	searchText: '',
	uploadSource: '',
	showAllowanceDialog: false,
	showUploadDialog: false,
	showSearchField: false,
	showFileTransfers: false,
	showDeleteDialog: false,
	showRenameDialog: false,
	dragging: false,
	contractCount: 0,
	allowance: '0',
	spending: '0',
})

export default function filesReducer(state = initialState, action) {
	switch (action.type) {
	case constants.RECEIVE_ALLOWANCE:
		return state.set('allowance', action.allowance)
	case constants.RECEIVE_SPENDING:
		return state.set('spending', action.spending)
	case constants.RECEIVE_FILES:
		return state.set('files', action.files)
		            .set('workingDirectoryFiles', ls(action.files, state.get('path')))
								// ensure `selected` contains no nonexistant files.
								.set('selected', state.get('selected').intersect(action.files.map((file) => file.siapath)))
	case constants.SET_ALLOWANCE:
		return state.set('allowance', action.funds)
	case constants.SET_SEARCH_TEXT:
		const results = searchFiles(state.get('files'), action.text, state.get('path'))
		return state.set('searchResults', results)
		            .set('searchText', action.text)
	case constants.SET_PATH:
		return state.set('path', action.path)
		            .set('workingDirectoryFiles', ls(state.get('files'), action.path))
								.set('selected', Set())
	case constants.DESELECT_FILE:
		return state.set('selected', state.get('selected').delete(action.siapath))
	case constants.SELECT_FILE:
		return state.set('selected', state.get('selected').add(action.siapath))
	case constants.DESELECT_ALL:
		return state.set('selected', Set())
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
		return state.set('downloading', action.downloads)
	case constants.SHOW_FILE_TRANSFERS:
		return state.set('showFileTransfers', true)
	case constants.HIDE_FILE_TRANSFERS:
		return state.set('showFileTransfers', false)
	case constants.TOGGLE_FILE_TRANSFERS:
		return state.set('showFileTransfers', !state.get('showFileTransfers'))
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
