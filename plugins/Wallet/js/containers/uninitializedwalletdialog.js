import UninitializedWalletDialogView from '../components/uninitializedwalletdialog.js'
import { showNewWalletForm, setUseCustomPassphrase, createNewWallet } from '../actions/wallet.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

const mapStateToProps = (state) => ({
	showNewWalletForm: state.wallet.get('showNewWalletForm'),
	useCustomPassphrase: state.wallet.get('useCustomPassphrase'),
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ showNewWalletForm, setUseCustomPassphrase, createNewWallet}, dispatch),
})

const UninitializedWalletDialog = connect(mapStateToProps, mapDispatchToProps)(UninitializedWalletDialogView)
export default UninitializedWalletDialog
