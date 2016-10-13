import AllowanceDialogView from '../components/allowancedialog.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { closeAllowanceDialog, setAllowance, getStorageEstimate } from '../actions/files.js'

const mapStateToProps = (state) => ({
	unlocked: state.wallet.get('unlocked'),
	storageEstimate: state.files.get('storageEstimate'),
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ closeAllowanceDialog, getStorageEstimate, setAllowance }, dispatch),
})

const AllowanceDialog = connect(mapStateToProps, mapDispatchToProps)(AllowanceDialogView)
export default AllowanceDialog
