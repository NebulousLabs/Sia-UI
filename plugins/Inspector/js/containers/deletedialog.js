import DeleteDialogView from '../components/deletedialog.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { hideDeleteDialog, deleteFile } from '../actions/files.js'

const mapStateToProps = (state) => ({
	files: state.deletedialog.get('files'),
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ hideDeleteDialog, deleteFile }, dispatch),
})

const DeleteDialog = connect(mapStateToProps, mapDispatchToProps)(DeleteDialogView)
export default DeleteDialog
