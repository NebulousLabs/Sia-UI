import NewWalletDialogView from '../components/newwalletdialog.js'
import { showConfirmationDialog } from '../actions/wallet.js'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
	password: state.newwalletdialog.get('password'),
	seed: state.newwalletdialog.get('seed'),
	showConfirmationDialog: state.newwalletdialog.get('showConfirmationDialog'),
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ showConfirmationDialog }, dispatch),
})

const NewWalletDialog = connect(mapStateToProps, mapDispatchToProps)(NewWalletDialogView)
export default NewWalletDialog
