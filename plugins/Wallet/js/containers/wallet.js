import WalletView from '../components/wallet.js';
import { connect } from 'react-redux';

const mapStateToProps = (state) => ({
	confirmedbalance: state.wallet.get('confirmedbalance'),
	unconfirmedbalance: state.wallet.get('unconfirmedbalance'),
	showReceivePrompt: state.wallet.get('showReceivePrompt'),
	showSendPrompt: state.wallet.get('showSendPrompt'),
	showNewWalletDialog: state.wallet.get('showNewWalletDialog'),
});

const Wallet = connect(mapStateToProps)(WalletView);
export default Wallet;
