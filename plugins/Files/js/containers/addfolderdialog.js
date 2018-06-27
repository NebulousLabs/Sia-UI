import AddFolderDialogView from '../components/addfolderdialog.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { hideAddFolderDialog, addFolder } from '../actions/files.js'

const mapStateToProps = () => ({})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ hideAddFolderDialog, addFolder }, dispatch),
})

const AddFolderDialog = connect(mapStateToProps, mapDispatchToProps)(
	AddFolderDialogView
)
export default AddFolderDialog
