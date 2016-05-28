import NewWalletDialogView from '../components/newwalletdialog.js'
import { dismissNewWalletDialog } from '../actions/wallet.js'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
	password: state.newwalletdialog.get('password'),
	seed: state.newwalletdialog.get('seed'),
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ dismissNewWalletDialog }, dispatch),
})

const NewWalletDialog = connect(mapStateToProps, mapDispatchToProps)(NewWalletDialogView)
export default NewWalletDialog
