import AllowanceDialogView from '../components/allowancedialog.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { closeAllowanceDialog, handleStorageSizeChange, setAllowance } from '../actions/files.js'

const mapStateToProps = (state) => ({
	storageSize: state.allowancedialog.get('storageSize'),
	storageCost: state.allowancedialog.get('storageCost'),
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ closeAllowanceDialog, handleStorageSizeChange, setAllowance }, dispatch),
})

const AllowanceDialog = connect(mapStateToProps, mapDispatchToProps)(AllowanceDialogView)
export default AllowanceDialog
