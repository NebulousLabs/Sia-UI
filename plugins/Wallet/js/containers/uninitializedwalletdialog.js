import UninitializedWalletDialogView from '../components/uninitializedwalletdialog.js'
import { showInitSeedForm, hideInitSeedForm, showNewWalletForm, setUseCustomPassphrase, createNewWallet } from '../actions/wallet.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

const mapStateToProps = (state) => ({
	showNewWalletForm: state.wallet.get('showNewWalletForm'),
	showInitSeedForm: state.wallet.get('showInitSeedForm'),
	useCustomPassphrase: state.wallet.get('useCustomPassphrase'),
	initializingSeed: state.wallet.get('initializingSeed'),
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ showInitSeedForm, hideInitSeedForm, showNewWalletForm, setUseCustomPassphrase, createNewWallet}, dispatch),
})

const UninitializedWalletDialog = connect(mapStateToProps, mapDispatchToProps)(UninitializedWalletDialogView)
export default UninitializedWalletDialog
