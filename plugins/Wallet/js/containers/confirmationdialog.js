import ConfirmationDialogView from '../components/confirmationdialog.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { hideConfirmationDialog, dismissNewWalletDialog, setConfirmationError } from '../actions/wallet.js'

const mapStateToProps = (state) => ({
	seed: state.newwalletdialog.get('seed'),
	password: state.newwalletdialog.get('password'),
	error: state.newwalletdialog.get('confirmationerror'),
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ hideConfirmationDialog, dismissNewWalletDialog, setConfirmationError }, dispatch),
})

const ConfirmationDialog = connect(mapStateToProps, mapDispatchToProps)(ConfirmationDialogView)
export default ConfirmationDialog
