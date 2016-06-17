import DeleteDialogView from '../components/deletedialog.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { hideDeleteDialog, deleteFile } from '../actions/files.js'

const mapStateToProps = (state) => ({
	siapath: state.deletedialog.get('siapath'),
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ hideDeleteDialog, deleteFile }, dispatch),
})

const DeleteDialog = connect(mapStateToProps, mapDispatchToProps)(DeleteDialogView)
export default DeleteDialog
