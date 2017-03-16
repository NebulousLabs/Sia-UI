import UninitializedWalletDialogView from '../components/uninitializedwalletdialog.js'
import { showNewWalletForm } from '../actions/wallet.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

const mapStateToProps = (state) => ({
	showNewWalletForm: state.wallet.get('showNewWalletForm'),
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ showNewWalletForm }, dispatch),
})

const UninitializedWalletDialog = connect(mapStateToProps, mapDispatchToProps)(UninitializedWalletDialogView)
export default UninitializedWalletDialog
