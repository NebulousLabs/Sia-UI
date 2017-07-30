import RenameDialogView from '../components/renamedialog.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { hideRenameDialog, renameFile } from '../actions/files.js'

const mapStateToProps = (state) => ({
	file: state.renamedialog.get('file'),
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ hideRenameDialog, renameFile }, dispatch),
})

const RenameDialog = connect(mapStateToProps, mapDispatchToProps)(RenameDialogView)
export default RenameDialog
