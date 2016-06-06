import AllowanceDialogView from '../components/allowancedialog.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { closeAllowanceDialog, handleStorageSizeChange } from '../actions/files.js'

const mapStateToProps = (state) => ({
	storageSize: state.allowancedialog.get('storageSize'),
	storageCost: state.allowancedialog.get('storageCost'),
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ closeAllowanceDialog, handleStorageSizeChange }, dispatch),
})

const AllowanceDialog = connect(mapStateToProps, mapDispatchToProps)(AllowanceDialogView)
export default AllowanceDialog
