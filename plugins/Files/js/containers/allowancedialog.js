import AllowanceDialogView from '../components/allowancedialog.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { showAllowanceConfirmation, hideAllowanceConfirmation, closeAllowanceDialog, setAllowance, setFeeEstimate, getStorageEstimate } from '../actions/files.js'

const mapStateToProps = (state) => ({
	unlocked: state.wallet.get('unlocked'),
	synced: state.wallet.get('synced'),
	storageEstimate: state.allowancedialog.get('storageEstimate'),
	feeEstimate: state.allowancedialog.get('feeEstimate'),
	confirmationAllowance: state.allowancedialog.get('confirmationAllowance'),
	confirming: state.allowancedialog.get('confirming'),
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ getStorageEstimate, setFeeEstimate, showAllowanceConfirmation, setAllowance, hideAllowanceConfirmation, closeAllowanceDialog}, dispatch),
})

const AllowanceDialog = connect(mapStateToProps, mapDispatchToProps)(AllowanceDialogView)
export default AllowanceDialog
