import UploadDialogView from '../components/uploaddialog.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { hideUploadDialog, uploadFile, uploadFolder } from '../actions/files.js'

const mapStateToProps = (state) => ({
	source: state.files.get('uploadSource'),
	path: state.files.get('path'),
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ hideUploadDialog, uploadFile, uploadFolder }, dispatch),
})

const UploadDialog = connect(mapStateToProps, mapDispatchToProps)(UploadDialogView)
export default UploadDialog
