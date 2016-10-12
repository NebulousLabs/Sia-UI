import FileListView from '../components/filelist.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setPath, selectFile, downloadFile, showDeleteDialog, showRenameDialog } from '../actions/files.js'

const mapStateToProps = (state) => ({
	files: state.files.get('workingDirectoryFiles'),
	selected: state.files.get('selected'),
	searchResults: state.files.get('searchResults'),
	path: state.files.get('path'),
	showSearchField: state.files.get('showSearchField'),
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ setPath, selectFile, showRenameDialog, downloadFile, showDeleteDialog }, dispatch),
})

const FileList = connect(mapStateToProps, mapDispatchToProps)(FileListView)
export default FileList
