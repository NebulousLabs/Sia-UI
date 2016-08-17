import FileBrowserView from '../components/filebrowser.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setDragging, setNotDragging, showUploadDialog } from '../actions/files.js'

const mapStateToProps = (state) => ({
	dragging: state.files.get('dragging'),
	showRenameDialog: state.files.get('showRenameDialog'),
	showUploadDialog: state.files.get('showUploadDialog'),
	showFileTransfers: state.files.get('showFileTransfers'),
	showDeleteDialog: state.files.get('showDeleteDialog'),
})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ setDragging, setNotDragging, showUploadDialog }, dispatch),
})

const FileBrowser = connect(mapStateToProps, mapDispatchToProps)(FileBrowserView)
export default FileBrowser
