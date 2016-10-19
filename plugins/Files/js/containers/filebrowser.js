import FileBrowserView from '../components/filebrowser.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setDragging, deselectAll, setNotDragging, showUploadDialog } from '../actions/files.js'

const mapStateToProps = (state) => ({
	dragging: state.files.get('dragging'),
	settingAllowance: state.files.get('settingAllowance'),
	showRenameDialog: state.files.get('showRenameDialog'),
	showUploadDialog: state.files.get('showUploadDialog'),
	showFileTransfers: state.files.get('showFileTransfers'),
	showDeleteDialog: state.files.get('showDeleteDialog'),
})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ setDragging, deselectAll, setNotDragging, showUploadDialog }, dispatch),
})

const FileBrowser = connect(mapStateToProps, mapDispatchToProps)(FileBrowserView)
export default FileBrowser
