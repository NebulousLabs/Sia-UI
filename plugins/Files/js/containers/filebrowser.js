import FileBrowserView from '../components/filebrowser.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setDragging, setNotDragging, showUploadDialog } from '../actions/files.js'

const mapStateToProps = (state) => ({
	activespending: state.files.get('activespending'),
	allocatedspending: state.files.get('allocatedspending'),
	dragging: state.files.get('dragging'),
	showUploadDialog: state.files.get('showUploadDialog'),
	showFileView: state.files.get('showFileView'),
	showFileTransfers: state.files.get('showFileTransfers'),
})

const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ setDragging, setNotDragging, showUploadDialog }, dispatch),
})

const FileBrowser = connect(mapStateToProps, mapDispatchToProps)(FileBrowserView)
export default FileBrowser
