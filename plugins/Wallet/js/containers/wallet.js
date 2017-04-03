import WalletView from '../components/wallet.js'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { startSendPrompt } from '../actions/wallet.js'

const mapStateToProps = (state) => ({
	synced: state.wallet.get('synced'),
	confirmedbalance: state.wallet.get('confirmedbalance'),
	unconfirmedbalance: state.wallet.get('unconfirmedbalance'),
	siafundbalance: state.wallet.get('siafundbalance'),
	showReceivePrompt: state.wallet.get('showReceivePrompt'),
	showSendPrompt: state.wallet.get('showSendPrompt'),
	showNewWalletDialog: state.wallet.get('showNewWalletDialog'),
	showRecoveryDialog: state.wallet.get('showRecoveryDialog'),
})
const mapDispatchToProps = (dispatch) => ({
	actions: bindActionCreators({ startSendPrompt }, dispatch),
})

const Wallet = connect(mapStateToProps, mapDispatchToProps)(WalletView)
export default Wallet
