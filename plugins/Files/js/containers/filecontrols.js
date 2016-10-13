import FileControlsView from '../components/filecontrols.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { downloadFile, showDeleteDialog } from '../actions/files.js'

const mapStateToProps = (state) => ({
	files: state.files.get('selected'),
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ downloadFile, showDeleteDialog }, dispatch),
})

const FileControls = connect(mapStateToProps, mapDispatchToProps)(FileControlsView)
export default FileControls
