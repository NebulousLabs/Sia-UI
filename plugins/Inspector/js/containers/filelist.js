import FileListView from '../components/filelist.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { renameSiaUIFolder, deleteSiaUIFolder, renameFile, getFiles, setDragFolderTarget, setDragFileOrigin, setDragUploadEnabled, setPath, selectUpTo, deselectFile, deselectAll, selectFile, downloadFile, showDeleteDialog, showRenameDialog, showFileDetail } from '../actions/files.js'

const mapStateToProps = (state) => ({
	files: state.files.get('workingDirectoryFiles'),
	selected: state.files.get('selected'),
	searchResults: state.files.get('searchResults'),
	path: state.files.get('path'),
	showSearchField: state.files.get('showSearchField'),
	dragFolderTarget: state.files.get('dragFolderTarget'),
	dragFileOrigin: state.files.get('dragFileOrigin'),
  showDetailPath: state.files.get('showDetailPath')
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ renameSiaUIFolder, deleteSiaUIFolder, getFiles, renameFile, setDragFileOrigin, setDragFolderTarget, setDragUploadEnabled, selectUpTo, setPath, deselectFile, deselectAll, selectFile, showRenameDialog, downloadFile, showDeleteDialog, showFileDetail }, dispatch),
})

const FileList = connect(mapStateToProps, mapDispatchToProps)(FileListView)
export default FileList
